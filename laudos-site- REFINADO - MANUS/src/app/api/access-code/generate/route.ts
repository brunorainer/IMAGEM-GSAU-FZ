import { NextRequest, NextResponse } from 'next/server';
import { generateAccessCode, calculateExpirationDate } from '@/lib/utils';
import { getCloudflareContext } from '@/lib/cloudflare';
import { requireAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Verificar se o usuário está autenticado
    const user = requireAuth();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }
    
    // Obter dados da requisição
    const { reportId } = await request.json();
    
    if (!reportId) {
      return NextResponse.json(
        { error: 'ID do laudo é obrigatório' },
        { status: 400 }
      );
    }
    
    // Obter contexto do Cloudflare
    const { env } = getCloudflareContext();
    
    // Verificar se o laudo existe
    const report = await env.DB.prepare(
      'SELECT id, expires_at FROM reports WHERE id = ?'
    )
      .bind(reportId)
      .first();
    
    if (!report) {
      return NextResponse.json(
        { error: 'Laudo não encontrado' },
        { status: 404 }
      );
    }
    
    // Gerar código de acesso único
    let accessCode = generateAccessCode();
    let isUnique = false;
    
    // Garantir que o código seja único
    while (!isUnique) {
      const existingCode = await env.DB.prepare(
        'SELECT id FROM access_codes WHERE code = ?'
      )
        .bind(accessCode)
        .first();
      
      if (!existingCode) {
        isUnique = true;
      } else {
        accessCode = generateAccessCode();
      }
    }
    
    // Calcular data de expiração (mesma do laudo)
    const expiresAt = new Date(report.expires_at);
    
    // Inserir código de acesso no banco de dados
    await env.DB.prepare(
      'INSERT INTO access_codes (code, report_id, expires_at) VALUES (?, ?, ?)'
    )
      .bind(accessCode, reportId, expiresAt.toISOString())
      .run();
    
    // Retornar código de acesso
    return NextResponse.json({
      success: true,
      accessCode,
      expiresAt: expiresAt.toISOString()
    });
  } catch (error) {
    console.error('Erro ao gerar código de acesso:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
