'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
type Cat = { id: number; name: string };
export default function NewProductPage() {
  const router = useRouter();
  const [cats, setCats] = useState<Cat[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('0');
  const [cost, setCost] = useState('0');
  const [stock, setStock] = useState('0');
  const [active, setActive] = useState(true);
  const [categoryId, setCategoryId] = useState<string>('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string|null>(null);
  useEffect(() => { fetch('/api/categories', { cache: 'no-store' }).then(r=>r.json()).then(d=>setCats(Array.isArray(d)?d:[])) }, []);
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setMsg(null); setBusy(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price:Number(price), cost:Number(cost), stock:Number(stock), active, categoryId: categoryId===''?null:Number(categoryId), description, image })
      });
      const j = await res.json().catch(()=>({}));
      if (!res.ok || !j?.ok) throw new Error(j?.error || 'Error');
      router.push('/admin/products'); router.refresh?.();
    } catch (err:any) { setMsg(err?.message || 'Error'); } finally { setBusy(false); }
  }
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Nuevo producto</h1>
      {msg && <p className="text-red-600 text-sm">{msg}</p>}
      <form onSubmit={onSubmit} className="space-y-3">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nombre" className="border px-3 py-2 rounded w-full" required />
        <div className="grid grid-cols-3 gap-3">
          <input value={price} onChange={e=>setPrice(e.target.value)} placeholder="Precio" className="border px-3 py-2 rounded w-full" />
          <input value={cost} onChange={e=>setCost(e.target.value)} placeholder="Costo" className="border px-3 py-2 rounded w-full" />
          <input value={stock} onChange={e=>setStock(e.target.value)} placeholder="Stock" className="border px-3 py-2 rounded w-full" />
        </div>
        <select value={categoryId} onChange={e=>setCategoryId(e.target.value)} className="border px-3 py-2 rounded w-full">
          <option value="">Sin categoría</option>
          {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Descripción" className="border px-3 py-2 rounded w-full" />
        <input value={image} onChange={e=>setImage(e.target.value)} placeholder="URL de imagen (opcional)" className="border px-3 py-2 rounded w-full" />
        <label className="flex items-center gap-2"><input type="checkbox" checked={active} onChange={e=>setActive(e.target.checked)} />Activo</label>
        <button disabled={busy} className="px-4 py-2 border rounded">{busy ? 'Guardando...' : 'Guardar'}</button>
      </form>
    </main>
  );
}
