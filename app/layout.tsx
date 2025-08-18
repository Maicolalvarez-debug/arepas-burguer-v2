import './globals.css'
import React from 'react'

export const metadata = {
  title: 'Arepas Burguer Admin',
  description: 'Admin estable con Prisma',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: 16 }}>
          <h1>Arepas Burguer - Admin</h1>
          <nav style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <a href="/">Inicio</a>
            <a href="/categories">Categorías</a>
            <a href="/products">Productos</a>
            <a href="/modifiers">Modificadores</a>
          </nav>
          {children}
        </div>
      </body>
    </html>
  )
}
