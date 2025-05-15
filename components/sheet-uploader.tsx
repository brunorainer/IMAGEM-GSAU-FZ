"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileSpreadsheet } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function SheetUploader({ onSheetData }: { onSheetData: (data: any[]) => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione uma planilha para continuar.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/parse-sheet", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Erro ao processar a planilha")
      }

      const data = await response.json()
      onSheetData(data.sheets)

      toast({
        title: "Planilha carregada com sucesso",
        description: `${data.sheets.length} registros encontrados.`,
      })
    } catch (error) {
      toast({
        title: "Erro ao processar planilha",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload de Planilha</CardTitle>
        <CardDescription>Faça upload da planilha com os dados dos turnos de ultrassonografia</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Input type="file" accept=".xlsx,.xls,.csv,.ods" onChange={handleFileChange} className="flex-1" />
          <Button onClick={handleUpload} disabled={!file || loading}>
            {loading ? (
              <span className="animate-pulse">Processando...</span>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Carregar
              </>
            )}
          </Button>
        </div>
        {file && (
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <FileSpreadsheet className="h-4 w-4" />
            <span>{file.name}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
