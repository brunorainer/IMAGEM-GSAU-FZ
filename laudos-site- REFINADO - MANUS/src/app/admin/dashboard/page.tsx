'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import UploadForm from '@/components/admin/UploadForm';
import ReportsList from '@/components/admin/ReportsList';
import CodeGenerator from '@/components/admin/CodeGenerator';
import GoogleDriveLink from '@/components/admin/GoogleDriveLink';

export default function AdminDashboard() {
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [showGoogleDriveLink, setShowGoogleDriveLink] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');

  const handleGenerateCode = (reportId: number) => {
    setSelectedReportId(reportId);
    setShowGoogleDriveLink(false);
  };

  const handleLinkGoogleDrive = (reportId: number) => {
    setSelectedReportId(reportId);
    setShowGoogleDriveLink(true);
  };

  const handleCloseModal = () => {
    setSelectedReportId(null);
    setShowGoogleDriveLink(false);
  };

  const handleUploadSuccess = () => {
    // Mudar para a aba de laudos após um upload bem-sucedido
    setActiveTab('reports');
  };

  return (
    <>
      <Header />
      <main className="flex-grow py-12">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-[#041E42] mb-6">Painel Administrativo</h1>

            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab('upload')}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === 'upload'
                        ? 'border-[#041E42] text-[#041E42]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Upload de Laudos
                  </button>
                  <button
                    onClick={() => setActiveTab('reports')}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === 'reports'
                        ? 'border-[#041E42] text-[#041E42]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Gerenciar Laudos
                  </button>
                </nav>
              </div>
            </div>

            <div className="mt-6">
              {activeTab === 'upload' ? (
                <UploadForm onUploadSuccess={handleUploadSuccess} />
              ) : (
                <ReportsList 
                  onGenerateCode={handleGenerateCode}
                  onLinkGoogleDrive={handleLinkGoogleDrive}
                />
              )}
            </div>
          </div>
        </div>
      </main>
      
      {selectedReportId && !showGoogleDriveLink && (
        <CodeGenerator
          reportId={selectedReportId}
          onClose={handleCloseModal}
        />
      )}
      
      {selectedReportId && showGoogleDriveLink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#041E42]">Vincular ao Google Drive</h2>
              <button 
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <GoogleDriveLink
              reportId={selectedReportId}
              onSuccess={handleCloseModal}
            />
          </div>
        </div>
      )}
      
      <Footer />
    </>
  );
}
