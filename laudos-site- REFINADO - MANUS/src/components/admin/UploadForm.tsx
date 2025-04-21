import { useState } from 'react';

export default function UploadForm({ onUploadSuccess }: { onUploadSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch('/api/reports/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer upload do laudo');
      }
      
      setSuccess('Laudo enviado com sucesso!');
      e.currentTarget.reset();
      
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao enviar o laudo');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="card border border-gray-200 p-6">
      <h2 className="admin-title">Upload de Laudo</h2>
      
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
          <label htmlFor="patientName" className="form-label">
            Nome do Paciente
          </label>
          <input
            type="text"
            id="patientName"
            name="patientName"
            className="form-input"
            required
          />
        </div>
        
        <div>
          <label htmlFor="examDate" className="form-label">
            Data do Exame
          </label>
          <input
            type="date"
            id="examDate"
            name="examDate"
            className="form-input"
            required
          />
        </div>
        
        <div>
          <label htmlFor="examType" className="form-label">
            Tipo de Exame
          </label>
          <input
            type="text"
            id="examType"
            name="examType"
            className="form-input"
            defaultValue="Ultrassonografia"
            required
          />
        </div>
        
        <div>
          <label htmlFor="doctorName" className="form-label">
            Médico Responsável
          </label>
          <input
            type="text"
            id="doctorName"
            name="doctorName"
            className="form-input"
            required
          />
        </div>
        
        <div>
          <label htmlFor="file" className="form-label">
            Arquivo PDF do Laudo
          </label>
          <input
            type="file"
            id="file"
            name="file"
            className="form-input"
            accept="application/pdf"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Apenas arquivos PDF são aceitos.
          </p>
        </div>
        
        <button
          type="submit"
          className="btn-primary w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Enviando...' : 'Enviar Laudo'}
        </button>
      </form>
    </div>
  );
}
