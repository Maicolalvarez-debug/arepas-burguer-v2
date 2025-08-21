
// app/admin/modifiers/new/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewModificadorPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [priceDelta, setPriceDelta] = useState<number | string>(0);
  const [costDelta, setCostDelta]   = useState<number | string>(0);
  const [stock, setStock]           = useState<number | string>(0);
  const [active, setActive]         = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null); setBusy(true);
    try {
      const res = await fetch('/api/modifiers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          priceDelta: Number(priceDelta),
          costDelta: Number(costDelta),
          stock: Number(stock),
          active,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json?.ok) throw new Error(json?.error || 'No se pudo crear');
      router.push('/admin/modifiers');
    } catch (err: any) {
      setMsg(err?.message || 'Error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-4 max-w-md space-y-4">
      <h1 className="text-xl font-semibold">Nuevo Modificador</h1>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Nombre</label>
          <input value={name} onChange={e=>setName(e.target.value)} className="w-full border rounded-lg px-3 py-2" required />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm mb-1">Precio</label>
            <input type="number" step="0.01" value={priceDelta} onChange={e=>setPriceDelta(e.target.value)} className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Costo</label>
            <input type="number" step="0.01" value={costDelta} onChange={e=>setCostDelta(e.target.value)} className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Stock</label>
            <input type="number" value={stock} onChange={e=>setStock(e.target.value)} className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div className="flex items-center gap-2 mt-6">
            <input id="active" type="checkbox" checked={active} onChange={e=>setActive(e.target.checked)} />
            <label htmlFor="active">Activo</label>
          </div>
        </div>
        <button disabled={busy} className="rounded-xl px-4 py-2 border">
          {busy ? 'Guardando…' : 'Crear'}
        </button>
        {msg && <div className="text-sm">{msg}</div>}
      </form>
    </div>
  );
}
