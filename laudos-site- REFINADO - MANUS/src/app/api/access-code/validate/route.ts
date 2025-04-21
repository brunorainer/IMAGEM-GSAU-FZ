import { NextRequest, NextResponse } from 'next/server';
import { isValidAccessCode } from '@/lib/utils';
import { getCloudflareContext } from '@/lib/cloudflare';

export async function POST(request: NextRequest) {
  try {
    // Obter código de acesso da requisição
    const { code } = await request.json();
    
    if (!code || !isValidAccessCode(code)) {
      return NextResponse.json(
        { error: 'Código de acesso inválido' },
        { status: 400 }
      );
    }
    
    // Obter contexto do Cloudflare
    const { env } = getCloudflareContext();
    
    // Verificar se o código existe e está válido
    const accessCode = await env.DB.prepare(`
      SELECT ac.id, ac.report_id, ac.expires_at, ac.is_used, 
             r.patient_name, r.exam_date, r.exam_type, r.doctor_name, r.file_path
      FROM access_codes ac
      JOIN reports r ON ac.report_id = r.id
      WHERE ac.code = ?
    `)
      .bind(code)
      .first();
    
    if (!accessCode) {
      return NextResponse.json(
        { error: 'Código de acesso não encontrado' },
        { status: 404 }
      );
    }
    
    // Verificar se o código expirou
    const expiresAt = new Date(accessCode.expires_at);
    const currentDate = new Date();
    
    if (currentDate > expiresAt) {
      return NextResponse.json(
        { error: 'Código de acesso expirado' },
        { status: 403 }
      );
    }
    
    // Registrar acesso
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    await env.DB.prepare(`
      INSERT INTO access_logs (access_code_id, ip_address, user_agent)
      VALUES (?, ?, ?)
    `)
      .bind(accessCode.id, clientIp, userAgent)
      .run();
    
    // Atualizar último acesso
    await env.DB.prepare(`
      UPDATE access_codes 
      SET is_used = TRUE, last_access = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
      .bind(accessCode.id)
      .run();
    
    // Retornar dados do laudo
    return NextResponse.json({
      success: true,
      report: {
        id: accessCode.report_id,
        patientName: accessCode.patient_name,
        examDate: accessCode.exam_date,
        examType: accessCode.exam_type,
        doctorName: accessCode.doctor_name,
        filePath: accessCode.file_path,
        expiresAt: accessCode.expires_at
      }
    });
  } catch (error) {
    console.error('Erro ao validar código de acesso:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
