'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export default function NewCategoryPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [active, setActive] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string|null>(null);
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setMsg(null); setBusy(true);
    try {
      const res = await fetch('/api/categories', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name, description, image, active }) });
      const j = await res.json().catch(()=>({}));
      if (!res.ok || !j?.ok) throw new Error(j?.error || 'Error');
      router.push('/admin/categories'); router.refresh?.();
    } catch (err:any) { setMsg(err?.message || 'Error'); } finally { setBusy(false); }
  }
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Nueva categoría</h1>
      {msg && <p className="text-red-600 text-sm">{msg}</p>}
      <form onSubmit={onSubmit} className="space-y-3">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nombre" className="border px-3 py-2 rounded w-full" required />
        <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Descripción" className="border px-3 py-2 rounded w-full" />
        <input value={image} onChange={e=>setImage(e.target.value)} placeholder="URL de imagen (opcional)" className="border px-3 py-2 rounded w-full" />
        <label className="flex items-center gap-2"><input type="checkbox" checked={active} onChange={e=>setActive(e.target.checked)} />Activo</label>
        <button disabled={busy} className="px-4 py-2 border rounded">{busy ? 'Guardando...' : 'Guardar'}</button>
      </form>
    </main>
  );
}
