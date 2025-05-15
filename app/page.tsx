"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { AuthButton } from "@/components/auth-button"
import { SheetUploader } from "@/components/sheet-uploader"
import { ColumnMapper } from "@/components/column-mapper"
import { EventPreview } from "@/components/event-preview"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Steps, Step } from "@/components/ui/steps"
import { useToast } from "@/hooks/use-toast"

type ColumnMapping = {
  title: string
  start: string
  end: string
  location: string
  description: string
}

type Event = {
  title: string
  start: string
  end?: string
  location?: string
  description?: string
}

export default function Home() {
  const { data: session, status } = useSession()
  const [step, setStep] = useState(1)
  const [sheetData, setSheetData] = useState<any[]>([])
  const [columns, setColumns] = useState<string[]>([])
  const [mapping, setMapping] = useState<ColumnMapping | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const { toast } = useToast()

  const handleSheetData = (data: any[]) => {
    if (data.length > 0) {
      setSheetData(data)
      setColumns(Object.keys(data[0]))
      setStep(2)
    }
  }

  const handleMappingComplete = (columnMapping: ColumnMapping) => {
    setMapping(columnMapping)

    // Converter dados da planilha para eventos
    const mappedEvents = sheetData.map((row) => {
      const event: Event = {
        title: row[columnMapping.title],
        start: row[columnMapping.start],
      }

      if (columnMapping.end && row[columnMapping.end]) {
        event.end = row[columnMapping.end]
      }

      if (columnMapping.location && row[columnMapping.location]) {
        event.location = row[columnMapping.location]
      }

      if (columnMapping.description && row[columnMapping.description]) {
        event.description = row[columnMapping.description]
      }

      return event
    })

    setEvents(mappedEvents)
    setStep(3)
  }

  const handleSync = async () => {
    try {
      const response = await fetch("/api/sync-calendar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ events }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao sincronizar calendário")
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error("Erro na sincronização:", error)
      toast({
        title: "Erro na sincronização",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido",
        variant: "destructive",
      })
      throw error
    }
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex flex-col items-center justify-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Sincronização Planilha-Calendário</h1>
        <p className="text-muted-foreground text-center max-w-2xl">
          Sincronize dados de turnos de ultrassonografia da sua planilha com o calendário Onelaudos
        </p>
      </div>

      <div className="flex justify-end mb-6">
        <AuthButton />
      </div>

      {status === "loading" ? (
        <Card className="w-full max-w-3xl mx-auto">
          <CardContent className="flex items-center justify-center p-8">
            <div className="animate-pulse text-center">
              <p>Carregando...</p>
            </div>
          </CardContent>
        </Card>
      ) : !session ? (
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Autenticação Necessária</CardTitle>
            <CardDescription>Faça login com sua conta Google para sincronizar com o calendário</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-8">
            <AuthButton />
          </CardContent>
        </Card>
      ) : (
        <div className="w-full max-w-3xl mx-auto space-y-8">
          <Steps value={step} className="mb-8">
            <Step value={1}>Upload da Planilha</Step>
            <Step value={2}>Mapeamento de Colunas</Step>
            <Step value={3}>Sincronização</Step>
          </Steps>

          {step === 1 && <SheetUploader onSheetData={handleSheetData} />}

          {step === 2 && columns.length > 0 && (
            <ColumnMapper columns={columns} onMappingComplete={handleMappingComplete} />
          )}

          {step === 3 && events.length > 0 && <EventPreview events={events} onSync={handleSync} />}
        </div>
      )}
    </main>
  )
}
