import './globals.css';
import Image from 'next/image';

export const metadata = { title: 'Arepas Burguer', description: 'Menú y pedidos' };

import ThemeSwitcher from '@/components/ThemeSwitcher';
export default function RootLayout({ children }: { children: React.ReactNode }){
  return (
    <html lang="es">
      <body>
        <header className="site-header">
          <div className="container inner">
            <Image src="/logo.png" alt="Arepas Burguer" width={44} height={44} priority />
            <div className="title">Arepas Burguer</div>
          </div>
          <ThemeSwitcher />
        </header>
        <main className="container">
          {children}
        </main>
      </body>
    </html>
  );
}
