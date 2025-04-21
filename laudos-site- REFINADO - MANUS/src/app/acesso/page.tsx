'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function AcessoPage() {
  const router = useRouter();
  const [codigo, setCodigo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/access-code/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: codigo }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Código de acesso inválido');
      }

      // Redirecionar para a página de visualização com os parâmetros necessários
      router.push(`/visualizar?reportId=${data.report.id}&code=${codigo}`);
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao validar o código');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="flex-grow py-12">
        <div className="container mx-auto">
          <div className="max-w-md mx-auto card">
            <h1 className="text-2xl font-bold text-[#041E42] mb-6 text-center">Acesso ao Laudo</h1>
            
            {error && (
              <div className="alert-error mb-6">
                <p>{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="codigo" className="form-label">
                  Código de Acesso
                </label>
                <input
                  type="text"
                  id="codigo"
                  name="codigo"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                  className="form-input"
                  placeholder="Digite o código fornecido pela clínica"
                  maxLength={8}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  O código foi fornecido durante a realização do seu exame.
                </p>
              </div>
              
              <button
                type="submit"
                className="btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Verificando...' : 'Acessar Laudo'}
              </button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-[#041E42] mb-4">Não tem um código de acesso?</h2>
              <p className="text-gray-600 mb-4">
                O código de acesso é fornecido pela clínica no momento da realização do seu exame. 
                Se você não recebeu seu código ou está com dificuldades para acessar seu laudo, 
                entre em contato com a clínica.
              </p>
              <div className="alert-info">
                <p>Seu código de acesso é válido por 3 meses após a data do exame.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
