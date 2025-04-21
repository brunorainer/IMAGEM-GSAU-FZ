import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getCloudflareContext } from '@/lib/cloudflare';
import { calculateExpirationDate } from '@/lib/utils';

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
    
    // Obter o formulário de dados
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const patientName = formData.get('patientName') as string;
    const examDate = formData.get('examDate') as string;
    const examType = formData.get('examType') as string;
    const doctorName = formData.get('doctorName') as string;
    
    // Validar dados
    if (!file || !patientName || !examDate || !examType || !doctorName) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }
    
    // Validar tipo de arquivo
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Apenas arquivos PDF são permitidos' },
        { status: 400 }
      );
    }
    
    // Obter contexto do Cloudflare
    const { env } = getCloudflareContext();
    
    // Gerar nome único para o arquivo
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name.replace(/\s+/g, '_')}`;
    
    // Fazer upload do arquivo para o R2
    const arrayBuffer = await file.arrayBuffer();
    await env.LAUDOS_BUCKET.put(fileName, arrayBuffer);
    
    // Calcular data de expiração (3 meses)
    const expiresAt = calculateExpirationDate(new Date());
    
    // Inserir registro do laudo no banco de dados
    const result = await env.DB.prepare(`
      INSERT INTO reports (patient_name, exam_date, exam_type, doctor_name, file_path, expires_at, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
      .bind(patientName, examDate, examType, doctorName, fileName, expiresAt.toISOString(), user.id)
      .run();
    
    // Obter ID do laudo inserido
    const reportId = result.meta?.last_row_id;
    
    // Retornar resposta de sucesso
    return NextResponse.json({
      success: true,
      report: {
        id: reportId,
        patientName,
        examDate,
        examType,
        doctorName,
        filePath: fileName,
        expiresAt: expiresAt.toISOString()
      }
    });
  } catch (error) {
    console.error('Erro ao fazer upload de laudo:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
