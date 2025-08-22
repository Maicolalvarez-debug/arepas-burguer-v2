'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export default function NewModifierPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [priceDelta, setPriceDelta] = useState('0');
  const [costDelta, setCostDelta] = useState('0');
  const [stock, setStock] = useState('0');
  const [active, setActive] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string|null>(null);
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setMsg(null); setBusy(true);
    try {
      const res = await fetch('/api/modifiers', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name, priceDelta:Number(priceDelta), costDelta:Number(costDelta), stock:Number(stock), active }) });
      const j = await res.json().catch(()=>({}));
      if (!res.ok || !j?.ok) throw new Error(j?.error || 'Error');
      router.push('/admin/modifiers'); router.refresh?.();
    } catch (err:any) { setMsg(err?.message || 'Error'); } finally { setBusy(false); }
  }
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Nuevo modificador</h1>
      {msg && <p className="text-red-600 text-sm">{msg}</p>}
      <form onSubmit={onSubmit} className="space-y-3">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nombre" className="border px-3 py-2 rounded w-full" required />
        <div className="grid grid-cols-3 gap-3">
          <input value={priceDelta} onChange={e=>setPriceDelta(e.target.value)} placeholder="Δ Precio" className="border px-3 py-2 rounded w-full" />
          <input value={costDelta} onChange={e=>setCostDelta(e.target.value)} placeholder="Δ Costo" className="border px-3 py-2 rounded w-full" />
          <input value={stock} onChange={e=>setStock(e.target.value)} placeholder="Stock" className="border px-3 py-2 rounded w-full" />
        </div>
        <label className="flex items-center gap-2"><input type="checkbox" checked={active} onChange={e=>setActive(e.target.checked)} />Activo</label>
        <button disabled={busy} className="px-4 py-2 border rounded">{busy ? 'Guardando...' : 'Guardar'}</button>
      </form>
    </main>
  );
}
