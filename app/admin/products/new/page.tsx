'use client';
// app/admin/products/new/page.tsx

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Cat = { id: number; name: string };

export default function NewProductoPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | string>(0);
  const [cost, setCost]   = useState<number | string>(0);
  const [stock, setStock] = useState<number | string>(0);
  const [active, setActive] = useState(true);
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [cats, setCats] = useState<Cat[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/categories');
        const json = await res.json();
        if (Array.isArray(json)) setCats(json);
      } catch {}
    })();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null); setBusy(true);
    try {
      const res = await fetch('/api/products', {  cache: 'no-store' ,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          price: Number(price)
      ,
cost: Number(cost),
          stock: Number(stock),
          active,
          categoryId: categoryId === '' ? null : Number(categoryId),
          description,
          image,
        }),
      });
      try { router.refresh(); } catch {}

      const json = await res.json();
      if (!res.ok || !json?.ok) throw new Error(json?.error || 'No se pudo crear');
      router.push('/admin/products');
    } catch (err: any) {
      setMsg(err?.message || 'Error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl space-y-4">
      <h1 className="text-xl font-semibold">Nuevo Producto</h1>
      <form onSubmit={submit} className="space-y-3">
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Nombre</label>
            <input value={name} onChange={e=>setName(e.target.value)} className="w-full border rounded-lg px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm mb-1">Categoría</label>
            <select value={categoryId} onChange={e=>setCategoryId(e.target.value === '' ? '' : Number(e.target.value))} className="w-full border rounded-lg px-3 py-2">
              <option value="">(Sin categoría)</option>
              {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Precio</label>
            <input type="number" step="0.01" value={price} onChange={e=>setPrice(e.target.value)} className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Costo</label>
            <input type="number" step="0.01" value={cost} onChange={e=>setCost(e.target.value)} className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Stock</label>
            <input type="number" value={stock} onChange={e=>setStock(e.target.value)} className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div className="flex items-center gap-2 mt-7">
            <input id="active" type="checkbox" checked={active} onChange={e=>setActive(e.target.checked)} />
            <label htmlFor="active">Activo</label>
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Descripción</label>
          <textarea value={description} onChange={e=>setDescription(e.target.value)} className="w-full border rounded-lg px-3 py-2 min-h-[100px]" />
        </div>
        <div>
          <label className="block text-sm mb-1">Imagen (URL)</label>
          <input value={image} onChange={e=>setImage(e.target.value)} className="w-full border rounded-lg px-3 py-2" />
        </div>

        <button disabled={busy} className="rounded-xl px-4 py-2 border">
          {busy ? 'Guardando…' : 'Crear'}
        </button>
        {msg && <div className="text-sm">{msg}</div>}
      </form>
    </div>
  );
}