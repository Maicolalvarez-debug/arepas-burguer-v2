
'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';

function FormInner() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get('next') || '/admin';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.message || 'Contraseña incorrecta');
      }
      window.location.replace(next);
    } catch (err:any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <input type="password" className="input" placeholder="Contraseña"
        value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button disabled={loading} className="btn-primary w-full">
        {loading ? 'Entrando…' : 'Ingresar'}
      </button>
    </form>
  );
}

export default function AdminLogin() {
  return (
    <div className="max-w-sm mx-auto mt-16 p-6 card">
      <h1 className="text-2xl font-semibold mb-4">Acceso de administrador</h1>
      <Suspense>
        <FormInner />
      </Suspense>
    </div>
  );
}
