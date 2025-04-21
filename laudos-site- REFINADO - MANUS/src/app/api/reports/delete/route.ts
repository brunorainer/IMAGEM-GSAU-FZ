import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getCloudflareContext } from '@/lib/cloudflare';

export async function DELETE(request: NextRequest) {
  try {
    // Verificar se o usuário está autenticado
    const user = requireAuth();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }
    
    // Obter ID do laudo da URL
    const url = new URL(request.url);
    const reportId = url.searchParams.get('id');
    
    if (!reportId) {
      return NextResponse.json(
        { error: 'ID do laudo é obrigatório' },
        { status: 400 }
      );
    }
    
    // Obter contexto do Cloudflare
    const { env } = getCloudflareContext();
    
    // Buscar informações do laudo
    const report = await env.DB.prepare(
      'SELECT file_path FROM reports WHERE id = ?'
    )
      .bind(reportId)
      .first();
    
    if (!report) {
      return NextResponse.json(
        { error: 'Laudo não encontrado' },
        { status: 404 }
      );
    }
    
    // Excluir códigos de acesso associados
    await env.DB.prepare(
      'DELETE FROM access_codes WHERE report_id = ?'
    )
      .bind(reportId)
      .run();
    
    // Excluir o laudo do banco de dados
    await env.DB.prepare(
      'DELETE FROM reports WHERE id = ?'
    )
      .bind(reportId)
      .run();
    
    // Excluir o arquivo do R2
    await env.LAUDOS_BUCKET.delete(report.file_path);
    
    // Retornar resposta de sucesso
    return NextResponse.json({
      success: true,
      message: 'Laudo excluído com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir laudo:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
