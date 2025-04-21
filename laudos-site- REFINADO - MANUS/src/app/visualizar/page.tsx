'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface ReportData {
  id: number;
  patientName: string;
  examDate: string;
  examType: string;
  doctorName: string;
  filePath: string;
  expiresAt: string;
}

function VisualizarContent() {
  const searchParams = useSearchParams();
  const reportId = searchParams.get('reportId');
  const accessCode = searchParams.get('code');
  
  const [report, setReport] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReportData = async () => {
      if (!reportId || !accessCode) {
        setError('Parâmetros inválidos. Volte à página de acesso e tente novamente.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/access-code/validate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code: accessCode }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Erro ao carregar laudo');
        }

        setReport(data.report);
      } catch (err: any) {
        setError(err.message || 'Ocorreu um erro ao carregar o laudo');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, [reportId, accessCode]);

  const handleDownload = () => {
    if (report && accessCode) {
      const url = `/api/reports/view?file=${report.filePath}&code=${accessCode}`;
      window.open(url, '_blank');
    }
  };

  const handlePrint = () => {
    if (report && accessCode) {
      const printWindow = window.open(`/api/reports/view?file=${report.filePath}&code=${accessCode}`, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto card flex items-center justify-center" style={{ minHeight: '500px' }}>
        <p className="text-gray-500">Carregando laudo...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-4xl mx-auto card">
        <h1 className="text-2xl font-bold text-[#041E42] mb-6">Erro</h1>
        <div className="alert-error">
          <p>{error || 'Não foi possível carregar o laudo.'}</p>
        </div>
        <div className="mt-6">
          <a href="/acesso" className="btn-primary inline-block">
            Voltar para página de acesso
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto card">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#041E42]">Visualização do Laudo</h1>
        <div className="flex space-x-2">
          <button 
            onClick={handleDownload}
            className="btn-secondary flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Baixar
          </button>
          <button 
            onClick={handlePrint}
            className="btn-secondary flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Imprimir
          </button>
        </div>
      </div>
      
      <div className="bg-gray-100 p-4 mb-6 rounded">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Paciente:</p>
            <p className="font-medium">{report.patientName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Data do Exame:</p>
            <p className="font-medium">{new Date(report.examDate).toLocaleDateString('pt-BR')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Tipo de Exame:</p>
            <p className="font-medium">{report.examType}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Médico Responsável:</p>
            <p className="font-medium">{report.doctorName}</p>
          </div>
        </div>
      </div>
      
      <div className="border border-gray-200 rounded min-h-[600px] mb-6">
        {report && accessCode ? (
          <iframe 
            src={`/api/reports/view?file=${report.filePath}&code=${accessCode}`}
            className="w-full h-[600px]"
            title="Visualizador de PDF"
          ></iframe>
        ) : (
          <div className="flex items-center justify-center h-[600px]">
            <p className="text-gray-500">Não foi possível carregar o visualizador de PDF</p>
          </div>
        )}
      </div>
      
      <div className="alert-info">
        <p>Este laudo estará disponível para acesso até {new Date(report.expiresAt).toLocaleDateString('pt-BR')} (3 meses após a data do exame).</p>
      </div>
    </div>
  );
}

export default function VisualizarPage() {
  return (
    <>
      <Header />
      <main className="flex-grow py-12">
        <div className="container mx-auto">
          <Suspense fallback={
            <div className="max-w-4xl mx-auto card flex items-center justify-center" style={{ minHeight: '500px' }}>
              <p className="text-gray-500">Carregando...</p>
            </div>
          }>
            <VisualizarContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
