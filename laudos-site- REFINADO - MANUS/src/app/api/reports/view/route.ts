import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@/lib/cloudflare';

export async function GET(request: NextRequest) {
  try {
    // Obter o filePath da URL
    const url = new URL(request.url);
    const filePath = url.searchParams.get('file');
    const accessCode = url.searchParams.get('code');
    
    if (!filePath || !accessCode) {
      return NextResponse.json(
        { error: 'Parâmetros inválidos' },
        { status: 400 }
      );
    }
    
    // Obter contexto do Cloudflare
    const { env } = getCloudflareContext();
    
    // Verificar se o código de acesso é válido para este arquivo
    const isValid = await env.DB.prepare(`
      SELECT ac.id
      FROM access_codes ac
      JOIN reports r ON ac.report_id = r.id
      WHERE ac.code = ? AND r.file_path = ?
    `)
      .bind(accessCode, filePath)
      .first();
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Acesso não autorizado' },
        { status: 403 }
      );
    }
    
    // Obter o arquivo do R2
    const file = await env.LAUDOS_BUCKET.get(filePath);
    
    if (!file) {
      return NextResponse.json(
        { error: 'Arquivo não encontrado' },
        { status: 404 }
      );
    }
    
    // Obter o conteúdo do arquivo
    const arrayBuffer = await file.arrayBuffer();
    
    // Retornar o arquivo como resposta
    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${filePath}"`,
      },
    });
  } catch (error) {
    console.error('Erro ao visualizar laudo:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
