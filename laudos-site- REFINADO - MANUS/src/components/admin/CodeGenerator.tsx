import { useState } from 'react';

interface CodeGeneratorProps {
  reportId: number | null;
  onClose: () => void;
}

export default function CodeGenerator({ reportId, onClose }: CodeGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  
  const generateCode = async () => {
    if (!reportId) return;
    
    setIsLoading(true);
    setError('');
    setAccessCode('');
    
    try {
      const response = await fetch('/api/access-code/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reportId }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao gerar código de acesso');
      }
      
      setAccessCode(data.accessCode);
      setExpiresAt(new Date(data.expiresAt).toLocaleDateString('pt-BR'));
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao gerar o código de acesso');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Gerar código automaticamente quando o componente for montado
  useState(() => {
    if (reportId) {
      generateCode();
    }
  });
  
  if (!reportId) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold text-[#041E42] mb-4">Código de Acesso</h2>
        
        {error && (
          <div className="alert-error mb-4">
            <p>{error}</p>
          </div>
        )}
        
        {isLoading ? (
          <div className="text-center py-8">
            <p>Gerando código de acesso...</p>
          </div>
        ) : accessCode ? (
          <div className="text-center py-4">
            <p className="mb-2 text-sm text-gray-600">Código de acesso gerado:</p>
            <div className="access-code text-xl font-bold mb-4">{accessCode}</div>
            <p className="text-sm text-gray-600">
              Válido até: {expiresAt}
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Forneça este código ao paciente para que ele possa acessar o laudo.
            </p>
          </div>
        ) : (
          <div className="text-center py-4">
            <p>Não foi possível gerar o código de acesso.</p>
          </div>
        )}
        
        <div className="flex justify-between mt-6">
          <button
            onClick={generateCode}
            className="btn-secondary"
            disabled={isLoading}
          >
            Gerar Novo
          </button>
          <button
            onClick={onClose}
            className="btn-primary"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
