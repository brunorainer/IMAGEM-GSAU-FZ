import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { google } from "googleapis"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const { events } = await request.json()

    if (!events || !Array.isArray(events) || events.length === 0) {
      return NextResponse.json({ error: "Nenhum evento fornecido" }, { status: 400 })
    }

    // Configurar cliente OAuth2
    const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET)

    oauth2Client.setCredentials({
      access_token: session.accessToken,
    })

    // Criar cliente do Calendar
    const calendar = google.calendar({ version: "v3", auth: oauth2Client })

    // Buscar calendário "Onelaudos"
    const calendarList = await calendar.calendarList.list()
    let onelaundosCalendar = calendarList.data.items?.find((cal) => cal.summary === "Onelaudos")

    // Se não encontrar o calendário, criar um novo
    if (!onelaundosCalendar) {
      const newCalendar = await calendar.calendars.insert({
        requestBody: {
          summary: "Onelaudos",
          description: "Calendário de turnos de ultrassonografia",
        },
      })
      onelaundosCalendar = newCalendar.data
    }

    const calendarId = onelaundosCalendar.id

    // Inserir eventos no calendário
    const results = await Promise.all(
      events.map(async (event) => {
        try {
          const calendarEvent = {
            summary: event.title,
            location: event.location,
            description: event.description,
            start: {
              dateTime: new Date(event.start).toISOString(),
              timeZone: "America/Sao_Paulo",
            },
            end: {
              dateTime: event.end
                ? new Date(event.end).toISOString()
                : new Date(new Date(event.start).getTime() + 60 * 60 * 1000).toISOString(), // Default: 1 hora após o início
              timeZone: "America/Sao_Paulo",
            },
          }

          const response = await calendar.events.insert({
            calendarId,
            requestBody: calendarEvent,
          })

          return {
            id: response.data.id,
            status: "success",
          }
        } catch (error) {
          console.error("Erro ao inserir evento:", error)
          return {
            event: event.title,
            status: "error",
            error: error instanceof Error ? error.message : "Erro desconhecido",
          }
        }
      }),
    )

    return NextResponse.json({
      success: true,
      results,
    })
  } catch (error) {
    console.error("Erro ao sincronizar calendário:", error)
    return NextResponse.json({ error: "Erro ao sincronizar calendário" }, { status: 500 })
  }
}
