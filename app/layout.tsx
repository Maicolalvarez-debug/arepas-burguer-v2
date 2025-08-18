import './globals.css';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = { title: 'Arepas Burguer', description: 'Menú, pedidos y administración', viewport: 'width=device-width, initial-scale=1' };

export default function RootLayout({ children }: { children: React.ReactNode }){
  return (
    <html lang="es">
      <body>
        <header className="w-full flex items-center justify-center py-4 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
          <Link href="/">
            <div className="bg-black p-2 rounded-xl shadow-lg">
              <Image src="/logo.png" alt="Arepas Burguer Logo" width={140} height={140} priority />
            </div>
          </Link>
        </header>
        
        <header className="site-header">
          <div className="container h-full flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.png" width={36} height={36} alt="Arepas Burguer" />
              <span className="font-extrabold text-xl tracking-wide">Arepas Burguer</span>
            </Link>
            <nav className="flex gap-2 text-sm">
              <Link className="btn" href="/menu">Menú</Link>
              <Link className="btn" href="/admin">Admin</Link>
            </nav>
          </div>
        </header>
        <main className="page-wrap container py-6">{children}</main>
      </body>
    </html>
  );
}
