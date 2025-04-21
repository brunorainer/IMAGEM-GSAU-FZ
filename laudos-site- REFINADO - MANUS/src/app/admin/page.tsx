import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function AdminPage() {
  return (
    <>
      <Header />
      <main className="flex-grow py-12">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto card">
            <h1 className="text-2xl font-bold text-[#041E42] mb-6">Painel Administrativo</h1>
            
            <div className="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50">
              <h2 className="admin-title">Login Administrativo</h2>
              <form className="space-y-4">
                <div>
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="senha" className="form-label">Senha</label>
                  <input
                    type="password"
                    id="senha"
                    name="senha"
                    className="form-input"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Entrar
                </button>
              </form>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="card border border-gray-200">
                <h3 className="text-lg font-semibold text-[#041E42] mb-4">Gerenciamento de Laudos</h3>
                <p className="text-gray-600 mb-4">
                  Faça upload de novos laudos, gerencie laudos existentes e configure códigos de acesso para pacientes.
                </p>
                <button disabled className="btn-primary opacity-50 cursor-not-allowed">
                  Acessar
                </button>
              </div>
              <div className="card border border-gray-200">
                <h3 className="text-lg font-semibold text-[#041E42] mb-4">Monitoramento de Acessos</h3>
                <p className="text-gray-600 mb-4">
                  Visualize estatísticas de acesso, monitore quais laudos foram acessados e quando.
                </p>
                <button disabled className="btn-primary opacity-50 cursor-not-allowed">
                  Acessar
                </button>
              </div>
            </div>
            
            <div className="alert-info">
              <p>Esta área é restrita a administradores autorizados. Todas as ações são registradas para fins de auditoria.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
