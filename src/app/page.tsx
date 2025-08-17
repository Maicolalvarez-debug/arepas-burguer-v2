export default function Home() {
  return (
    <main style={{padding: 24}}>
      <h1>Arepas Burguer</h1>
      <p>Starter listo para Vercel + Prisma.</p>
      <ul>
        <li><a href="/api/health">/api/health</a> — Chequeo rápido</li>
        <li><a href="/api/seed">/api/seed</a> — (Opcional) Carga data demo</li>
      </ul>
      <p style={{marginTop: 16}}>Configura tu <code>DATABASE_URL</code> en Vercel para usar la base de datos.</p>
    </main>
  );
}
