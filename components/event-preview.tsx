"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Loader2, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type Event = {
  title: string
  start: string
  end?: string
  location?: string
  description?: string
}

export function EventPreview({
  events,
  onSync,
}: {
  events: Event[]
  onSync: () => Promise<void>
}) {
  const [syncing, setSyncing] = useState(false)
  const [syncComplete, setSyncComplete] = useState(false)
  const { toast } = useToast()

  const handleSync = async () => {
    setSyncing(true)
    try {
      await onSync()
      setSyncComplete(true)
      toast({
        title: "Sincronização concluída",
        description: `${events.length} eventos foram adicionados ao calendário Onelaudos.`,
      })
    } catch (error) {
      toast({
        title: "Erro na sincronização",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido",
        variant: "destructive",
      })
    } finally {
      setSyncing(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Prévia dos Eventos</CardTitle>
        <CardDescription>Revise os eventos antes de sincronizar com o calendário Onelaudos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Início</TableHead>
                <TableHead>Término</TableHead>
                <TableHead>Local</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.length > 0 ? (
                events.slice(0, 5).map((event, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>{event.start}</TableCell>
                    <TableCell>{event.end || "—"}</TableCell>
                    <TableCell>{event.location || "—"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Nenhum evento para exibir
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {events.length > 5 && (
          <p className="mt-2 text-sm text-muted-foreground">Mostrando 5 de {events.length} eventos</p>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSync}
          disabled={events.length === 0 || syncing || syncComplete}
          className="w-full sm:w-auto"
        >
          {syncing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sincronizando...
            </>
          ) : syncComplete ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Sincronizado
            </>
          ) : (
            <>
              <Calendar className="mr-2 h-4 w-4" />
              Sincronizar com Calendário
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
