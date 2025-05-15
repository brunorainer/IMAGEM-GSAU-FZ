import { type NextRequest, NextResponse } from "next/server"
import * as XLSX from "xlsx"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 })
    }

    // Verificar tipo de arquivo
    const allowedTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
      "application/vnd.oasis.opendocument.spreadsheet",
    ]

    if (
      !allowedTypes.includes(file.type) &&
      !file.name.endsWith(".xlsx") &&
      !file.name.endsWith(".xls") &&
      !file.name.endsWith(".csv") &&
      !file.name.endsWith(".ods")
    ) {
      return NextResponse.json({ error: "Tipo de arquivo não suportado" }, { status: 400 })
    }

    // Ler o arquivo
    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: "array" })

    // Pegar a primeira planilha
    const firstSheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[firstSheetName]

    // Converter para JSON
    const data = XLSX.utils.sheet_to_json(worksheet)

    // Extrair colunas
    const columns = data.length > 0 ? Object.keys(data[0]) : []

    return NextResponse.json({
      sheets: data,
      columns,
    })
  } catch (error) {
    console.error("Erro ao processar planilha:", error)
    return NextResponse.json({ error: "Erro ao processar planilha" }, { status: 500 })
  }
}
