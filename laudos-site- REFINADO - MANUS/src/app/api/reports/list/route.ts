import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getCloudflareContext } from '@/lib/cloudflare';

export async function GET(request: NextRequest) {
  try {
    // Verificar se o usuário está autenticado
    const user = requireAuth();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }
    
    // Obter contexto do Cloudflare
    const { env } = getCloudflareContext();
    
    // Obter parâmetros de paginação
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;
    
    // Buscar laudos no banco de dados
    const reports = await env.DB.prepare(`
      SELECT r.id, r.patient_name, r.exam_date, r.exam_type, r.doctor_name, 
             r.file_path, r.created_at, r.expires_at,
             (SELECT COUNT(*) FROM access_codes ac WHERE ac.report_id = r.id) as access_codes_count
      FROM reports r
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `)
      .bind(limit, offset)
      .all();
    
    // Contar total de laudos
    const totalCount = await env.DB.prepare('SELECT COUNT(*) as count FROM reports')
      .first();
    
    // Retornar lista de laudos
    return NextResponse.json({
      success: true,
      reports: reports.results,
      pagination: {
        page,
        limit,
        totalItems: totalCount.count,
        totalPages: Math.ceil(totalCount.count / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao listar laudos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
