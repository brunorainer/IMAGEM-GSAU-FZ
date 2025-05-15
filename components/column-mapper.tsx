"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

type ColumnMapping = {
  title: string
  start: string
  end: string
  location: string
  description: string
}

export function ColumnMapper({
  columns,
  onMappingComplete,
}: {
  columns: string[]
  onMappingComplete: (mapping: ColumnMapping) => void
}) {
  const [mapping, setMapping] = useState<ColumnMapping>({
    title: "",
    start: "",
    end: "",
    location: "",
    description: "",
  })

  const handleChange = (field: keyof ColumnMapping, value: string) => {
    setMapping((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    // Verificar se os campos obrigatórios estão preenchidos
    if (!mapping.title || !mapping.start) {
      return
    }

    onMappingComplete(mapping)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Mapeamento de Colunas</CardTitle>
        <CardDescription>Associe as colunas da sua planilha aos campos do calendário</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">
              Título do Evento <span className="text-red-500">*</span>
            </Label>
            <Select value={mapping.title} onValueChange={(value) => handleChange("title", value)}>
              <SelectTrigger id="title">
                <SelectValue placeholder="Selecione a coluna" />
              </SelectTrigger>
              <SelectContent>
                {columns.map((column) => (
                  <SelectItem key={column} value={column}>
                    {column}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="start">
              Data/Hora de Início <span className="text-red-500">*</span>
            </Label>
            <Select value={mapping.start} onValueChange={(value) => handleChange("start", value)}>
              <SelectTrigger id="start">
                <SelectValue placeholder="Selecione a coluna" />
              </SelectTrigger>
              <SelectContent>
                {columns.map((column) => (
                  <SelectItem key={column} value={column}>
                    {column}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="end">Data/Hora de Término</Label>
            <Select value={mapping.end} onValueChange={(value) => handleChange("end", value)}>
              <SelectTrigger id="end">
                <SelectValue placeholder="Selecione a coluna" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no_mapping">Não mapear</SelectItem>
                {columns.map((column) => (
                  <SelectItem key={column} value={column}>
                    {column}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Local</Label>
            <Select value={mapping.location} onValueChange={(value) => handleChange("location", value)}>
              <SelectTrigger id="location">
                <SelectValue placeholder="Selecione a coluna" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no_mapping">Não mapear</SelectItem>
                {columns.map((column) => (
                  <SelectItem key={column} value={column}>
                    {column}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Descrição</Label>
            <Select value={mapping.description} onValueChange={(value) => handleChange("description", value)}>
              <SelectTrigger id="description">
                <SelectValue placeholder="Selecione a coluna" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no_mapping">Não mapear</SelectItem>
                {columns.map((column) => (
                  <SelectItem key={column} value={column}>
                    {column}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={!mapping.title || !mapping.start}>
          Confirmar Mapeamento
        </Button>
      </CardFooter>
    </Card>
  )
}
