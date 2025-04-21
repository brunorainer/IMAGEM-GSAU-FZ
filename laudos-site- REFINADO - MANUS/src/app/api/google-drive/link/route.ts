import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getCloudflareContext } from '@/lib/cloudflare';

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
    const { reportId, driveFileId, driveFileUrl } = await request.json();
    
    if (!reportId || (!driveFileId && !driveFileUrl)) {
      return NextResponse.json(
        { error: 'ID do laudo e informações do Google Drive são obrigatórios' },
        { status: 400 }
      );
    }
    
    // Obter contexto do Cloudflare
    const { env } = getCloudflareContext();
    
    // Verificar se o laudo existe
    const report = await env.DB.prepare(
      'SELECT id FROM reports WHERE id = ?'
    )
      .bind(reportId)
      .first();
    
    if (!report) {
      return NextResponse.json(
        { error: 'Laudo não encontrado' },
        { status: 404 }
      );
    }
    
    // Atualizar o laudo com informações do Google Drive
    await env.DB.prepare(`
      UPDATE reports 
      SET drive_file_id = ?, drive_file_url = ?
      WHERE id = ?
    `)
      .bind(driveFileId || null, driveFileUrl || null, reportId)
      .run();
    
    // Retornar resposta de sucesso
    return NextResponse.json({
      success: true,
      message: 'Laudo vinculado ao Google Drive com sucesso'
    });
  } catch (error) {
    console.error('Erro ao vincular laudo ao Google Drive:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
