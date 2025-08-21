
// app/admin/modifiers/[id]/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EditModificadorPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const id = Number(params.id);
  const [name, setName] = useState('');
  const [priceDelta, setPriceDelta] = useState<number | string>(0);
  const [costDelta, setCostDelta]   = useState<number | string>(0);
  const [stock, setStock]           = useState<number | string>(0);
  const [active, setActive]         = useState(true);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/modifiers/' + id);
        const json = await res.json();
        if (!res.ok || !json?.id) throw new Error('No encontrado');
        if (mounted) {
          setName(json.name || '');
          setPriceDelta(json.priceDelta ?? 0);
          setCostDelta(json.costDelta ?? 0);
          setStock(json.stock ?? 0);
          setActive(Boolean(json.active));
        }
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
      const res = await fetch('/api/modifiers/' + id, {
        method: 'PATCH',
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
      if (!res.ok || !json?.ok) throw new Error(json?.error || 'No se pudo actualizar');
      router.push('/admin/modifiers');
    } catch (err: any) {
      setMsg(err?.message || 'Error');
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className="p-4">Cargando…</div>;

  return (
    <div className="p-4 max-w-md space-y-4">
      <h1 className="text-xl font-semibold">Editar Modificador</h1>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Nombre</label>
          <input value={name} onChange={e=>setName(e.target.value)} className="w-full border rounded-lg px-3 py-2" required />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm mb-1">priceDelta</label>
            <input type="number" step="0.01" value={priceDelta} onChange={e=>setPriceDelta(e.target.value)} className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">costDelta</label>
            <input type="number" step="0.01" value={costDelta} onChange={e=>setCostDelta(e.target.value)} className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">stock</label>
            <input type="number" value={stock} onChange={e=>setStock(e.target.value)} className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div className="flex items-center gap-2 mt-6">
            <input id="active" type="checkbox" checked={active} onChange={e=>setActive(e.target.checked)} />
            <label htmlFor="active">Activo</label>
          </div>
        </div>
        <button disabled={busy} className="rounded-xl px-4 py-2 border">
          {busy ? 'Guardando…' : 'Guardar cambios'}
        </button>
        {msg && <div className="text-sm">{msg}</div>}
      </form>
    </div>
  );
}
