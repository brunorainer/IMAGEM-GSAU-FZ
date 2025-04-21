import { useState, useEffect } from 'react';
import { formatDate } from '@/lib/utils';

interface Report {
  id: number;
  patient_name: string;
  exam_date: string;
  exam_type: string;
  doctor_name: string;
  file_path: string;
  drive_file_id: string | null;
  drive_file_url: string | null;
  created_at: string;
  expires_at: string;
  access_codes_count: number;
}

interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

interface ReportsListProps {
  onGenerateCode: (reportId: number) => void;
  onLinkGoogleDrive: (reportId: number) => void;
}

export default function ReportsList({ onGenerateCode, onLinkGoogleDrive }: ReportsListProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReports = async (page = 1) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/reports/list?page=${page}&limit=${pagination.limit}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao carregar laudos');
      }
      
      setReports(data.reports);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao carregar os laudos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      fetchReports(newPage);
    }
  };

  const handleDeleteReport = async (reportId: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este laudo? Esta ação não pode ser desfeita.')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/reports/delete?id=${reportId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao excluir laudo');
      }
      
      // Recarregar a lista de laudos
      fetchReports(pagination.page);
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao excluir o laudo');
    }
  };

  if (isLoading && reports.length === 0) {
    return <div className="text-center py-8">Carregando laudos...</div>;
  }

  if (error && reports.length === 0) {
    return (
      <div className="alert-error">
        <p>{error}</p>
        <button 
          onClick={() => fetchReports()} 
          className="mt-2 text-sm underline"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">Nenhum laudo encontrado.</p>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="alert-error mb-4">
          <p>{error}</p>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Paciente
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Data do Exame
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Médico
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Google Drive
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Códigos
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reports.map((report) => (
              <tr key={report.id}>
                <td className="py-4 px-4 text-sm">{report.patient_name}</td>
                <td className="py-4 px-4 text-sm">{new Date(report.exam_date).toLocaleDateString('pt-BR')}</td>
                <td className="py-4 px-4 text-sm">{report.exam_type}</td>
                <td className="py-4 px-4 text-sm">{report.doctor_name}</td>
                <td className="py-4 px-4 text-sm">
                  {report.drive_file_url ? (
                    <a 
                      href={report.drive_file_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#0A3161] hover:text-[#1E5AA8]"
                    >
                      Vinculado
                    </a>
                  ) : (
                    <span className="text-gray-400">Não vinculado</span>
                  )}
                </td>
                <td className="py-4 px-4 text-sm">{report.access_codes_count}</td>
                <td className="py-4 px-4 text-sm space-x-2">
                  <button
                    onClick={() => onGenerateCode(report.id)}
                    className="text-[#0A3161] hover:text-[#1E5AA8]"
                    title="Gerar código de acesso"
                  >
                    Gerar Código
                  </button>
                  <button
                    onClick={() => onLinkGoogleDrive(report.id)}
                    className="text-[#0A3161] hover:text-[#1E5AA8]"
                    title="Vincular ao Google Drive"
                  >
                    Google Drive
                  </button>
                  <button
                    onClick={() => handleDeleteReport(report.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Excluir laudo"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {pagination.totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <div>
            <span className="text-sm text-gray-500">
              Mostrando {(pagination.page - 1) * pagination.limit + 1} a {Math.min(pagination.page * pagination.limit, pagination.totalItems)} de {pagination.totalItems} laudos
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className={`px-3 py-1 rounded ${
                pagination.page === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-[#041E42] text-white hover:bg-[#0A3161]'
              }`}
            >
              Anterior
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className={`px-3 py-1 rounded ${
                pagination.page === pagination.totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-[#041E42] text-white hover:bg-[#0A3161]'
              }`}
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
