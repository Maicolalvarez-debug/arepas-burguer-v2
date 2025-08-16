import "./globals.css";
import Link from "next/link";

export const metadata = { title: "Arepas Burguer", description: "Menú y administración" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <header className="border-b border-white/10">
          <div className="container flex items-center justify-between py-4">
            <Link href="/" className="font-bold text-xl">Arepas Burguer</Link>
            <nav className="flex gap-3 text-sm">
              <Link className="btn" href="/menu">Menú</Link>
              <Link className="btn" href="/admin">Admin</Link>
            </nav>
          </div>
        </header>
        <main className="container py-6">{children}</main>
        <footer className="container py-10 text-sm text-gray-400">
          <div className="border-t border-white/10 pt-6">
            Hecho para Arepas Burguer
          </div>
        </footer>
      </body>
    </html>
  );
}
