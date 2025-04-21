import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@/lib/cloudflare';

// Esta rota será chamada por um cron job para limpar laudos expirados
export async function POST(request: NextRequest) {
  try {
    // Verificar chave de API para segurança (em produção, usar um sistema mais robusto)
    const apiKey = request.headers.get('x-api-key');
    if (apiKey !== process.env.CLEANUP_API_KEY) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }
    
    // Obter contexto do Cloudflare
    const { env } = getCloudflareContext();
    
    // Obter laudos expirados
    const currentDate = new Date().toISOString();
    const expiredReports = await env.DB.prepare(`
      SELECT id, file_path FROM reports 
      WHERE expires_at < ?
    `)
      .bind(currentDate)
      .all();
    
    if (!expiredReports.results || expiredReports.results.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Nenhum laudo expirado encontrado',
        removedCount: 0
      });
    }
    
    // Excluir laudos expirados
    let removedCount = 0;
    
    for (const report of expiredReports.results) {
      // Excluir códigos de acesso associados
      await env.DB.prepare(
        'DELETE FROM access_codes WHERE report_id = ?'
      )
        .bind(report.id)
        .run();
      
      // Excluir o laudo do banco de dados
      await env.DB.prepare(
        'DELETE FROM reports WHERE id = ?'
      )
        .bind(report.id)
        .run();
      
      // Excluir o arquivo do R2
      await env.LAUDOS_BUCKET.delete(report.file_path);
      
      removedCount++;
    }
    
    // Retornar resposta de sucesso
    return NextResponse.json({
      success: true,
      message: `${removedCount} laudos expirados foram removidos`,
      removedCount
    });
  } catch (error) {
    console.error('Erro ao limpar laudos expirados:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
