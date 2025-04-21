import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <section className="bg-[#0A3161] text-white py-16">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Portal de Laudos Médicos</h1>
            <p className="text-xl mb-8">Acesse seus laudos de ultrassonografia de forma segura e rápida</p>
            <Link href="/acesso" className="bg-white text-[#041E42] font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors">
              Acessar meu laudo
            </Link>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto">
            <h2 className="section-title text-center mb-12">Como funciona</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card text-center">
                <div className="bg-[#041E42] text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Receba seu código</h3>
                <p>Após realizar seu exame, você receberá um código de acesso único.</p>
              </div>
              <div className="card text-center">
                <div className="bg-[#041E42] text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Acesse o portal</h3>
                <p>Entre no portal e insira seu código de acesso na página de acesso.</p>
              </div>
              <div className="card text-center">
                <div className="bg-[#041E42] text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Visualize seu laudo</h3>
                <p>Visualize, baixe ou imprima seu laudo de forma segura.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto">
            <h2 className="section-title text-center mb-12">Segurança e Privacidade</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="card">
                <h3 className="text-xl font-semibold mb-2">Seus dados estão protegidos</h3>
                <p>Utilizamos tecnologia de ponta para garantir a segurança dos seus dados médicos. Todos os laudos são armazenados de forma segura e criptografada.</p>
              </div>
              <div className="card">
                <h3 className="text-xl font-semibold mb-2">Acesso exclusivo</h3>
                <p>Apenas você, com seu código de acesso único, pode visualizar seus laudos. Os códigos são gerados de forma aleatória e segura.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
