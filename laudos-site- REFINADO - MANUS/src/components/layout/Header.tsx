import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="header">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold ml-2">Portal de Laudos Médicos</span>
          </Link>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/" className="nav-link">
                Início
              </Link>
            </li>
            <li>
              <Link href="/acesso" className="nav-link">
                Acessar Laudo
              </Link>
            </li>
            <li>
              <Link href="/admin" className="nav-link">
                Área Administrativa
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
