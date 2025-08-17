
import './globals.css';
import Image from 'next/image';

export const metadata = { title: 'Arepas Burguer', description: 'Menú, administración e inventario' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div className="watermark" />
        <header className="header">
          <div className="header-inner">
            <div className="brand">
              <Image src="/logo.png" alt="Arepas Burguer" width={36} height={36} />
              <span>Arepas Burguer</span>
            </div>
            <nav className="muted">
              <a href="/menu">Ver menú</a> · <a href="/admin">Admin</a>
            </nav>
          </div>
        </header>
        <main className="main container">{children}</main>
      </body>
    </html>
  );
}
