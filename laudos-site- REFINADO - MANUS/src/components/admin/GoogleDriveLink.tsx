'use client';

import { useState } from 'react';

interface GoogleDriveLinkProps {
  reportId: number;
  onSuccess: () => void;
}

export default function GoogleDriveLink({ reportId, onSuccess }: GoogleDriveLinkProps) {
  const [driveFileUrl, setDriveFileUrl] = useState('');
  const [driveFileId, setDriveFileId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Extrair ID do arquivo do Google Drive a partir da URL
  const extractDriveFileId = (url: string) => {
    try {
      const regex = /[-\w]{25,}/;
      const match = url.match(regex);
      if (match) {
        setDriveFileId(match[0]);
      }
    } catch (err) {
      // Manter o ID vazio em caso de erro
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setDriveFileUrl(url);
    extractDriveFileId(url);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (!driveFileUrl) {
      setError('URL do arquivo no Google Drive é obrigatória');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/google-drive/link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportId,
          driveFileId,
          driveFileUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao vincular arquivo do Google Drive');
      }

      setSuccess('Arquivo do Google Drive vinculado com sucesso!');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao vincular o arquivo do Google Drive');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card border border-gray-200 p-6">
      <h2 className="admin-title">Vincular ao Google Drive</h2>
      
      {error && (
        <div className="alert-error mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {success && (
        <div className="alert-success mb-4">
          <p>{success}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="driveFileUrl" className="form-label">
            URL do Arquivo no Google Drive
          </label>
          <input
            type="url"
            id="driveFileUrl"
            name="driveFileUrl"
            value={driveFileUrl}
            onChange={handleUrlChange}
            className="form-input"
            placeholder="https://drive.google.com/file/d/..."
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Cole o link de compartilhamento do arquivo no Google Drive.
          </p>
        </div>
        
        {driveFileId && (
          <div>
            <label className="form-label">ID do Arquivo (extraído automaticamente)</label>
            <input
              type="text"
              value={driveFileId}
              className="form-input bg-gray-50"
              readOnly
            />
          </div>
        )}
        
        <button
          type="submit"
          className="btn-primary w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Vinculando...' : 'Vincular Arquivo'}
        </button>
      </form>
    </div>
  );
}
