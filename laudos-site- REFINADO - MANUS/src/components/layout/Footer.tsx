export default function Footer() {
  return (
    <footer className="footer mt-auto">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Portal de Laudos Médicos</h3>
            <p className="text-sm">
              Sistema seguro para acesso a laudos de ultrassonografia.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Links Úteis</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-sm hover:text-[#FFCD00] transition-colors">
                  Início
                </a>
              </li>
              <li>
                <a href="/acesso" className="text-sm hover:text-[#FFCD00] transition-colors">
                  Acessar Laudo
                </a>
              </li>
              <li>
                <a href="/privacidade" className="text-sm hover:text-[#FFCD00] transition-colors">
                  Política de Privacidade
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Contato</h3>
            <p className="text-sm">
              Em caso de dúvidas, entre em contato com a clínica.
            </p>
          </div>
        </div>
        <div className="border-t border-[#1E5AA8] mt-8 pt-8 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Portal de Laudos Médicos. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
