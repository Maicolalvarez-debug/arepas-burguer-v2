
// app/admin/products/[id]/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EditProductoPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const id = Number(params.id);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/products/' + id);
        const json = await res.json();
        if (!res.ok || !json?.id) throw new Error('No encontrado');
        if (mounted) setName(json.name || '');
      } catch (e: any) {
        setMsg(e?.message || 'Error cargando datos');
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false };
  }, [id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null); setBusy(true);
    try {
      const res = await fetch('/api/products/' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const json = await res.json();
      if (!res.ok || !json?.ok) throw new Error(json?.error || 'No se pudo actualizar');
      router.push('/admin/products');
    } catch (err: any) {
      setMsg(err?.message || 'Error');
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className="p-4">Cargando…</div>;

  return (
    <div className="p-4 max-w-md space-y-4">
      <h1 className="text-xl font-semibold">Editar Producto</h1>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Nombre</label>
          <input
            value={name} onChange={e => setName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Nombre"
            required
          />
        </div>
        <div className="flex gap-2">
          <button disabled={busy} className="rounded-xl px-4 py-2 border">
            {busy ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </div>
        {msg && <div className="text-sm">{msg}</div>}
      </form>
    </div>
  );
}
