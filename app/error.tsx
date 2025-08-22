'use client';
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  return (
    <html>
      <body className="p-6 text-center">
        <h2 className="text-lg font-semibold mb-2">Ocurrió un error</h2>
        <p className="text-sm opacity-80 mb-4">{error?.message || 'Error inesperado'}</p>
        <button onClick={() => reset()} className="btn">Reintentar</button>
      </body>
    </html>
  );
}
