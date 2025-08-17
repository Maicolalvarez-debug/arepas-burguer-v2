import Link from "next/link";

export default function Home() {
  return (
    <main className="container py-12 space-y-6">
      <h1 className="text-3xl font-bold">Arepas Burguer</h1>
      <p className="text-neutral-300">Starter listo para Vercel + Prisma + Tailwind.</p>
      <ul className="list-disc pl-6 space-y-2">
        <li><a className="underline" href="/api/health">/api/health</a> — Chequeo rápido</li>
        <li><a className="underline" href="/api/seed">/api/seed</a> — (Opcional) Carga data demo</li>
        <li><Link className="underline" href="/menu">/menu</Link> — Vista pública del menú</li>
      </ul>
      <p className="text-sm text-neutral-400">Configura <code>DATABASE_URL</code> en Vercel para usar la base de datos.</p>
    </main>
  );
}
