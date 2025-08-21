
// app/admin/products/ProductsClient.tsx
'use client';

import Link from 'next/link';
import {{ useState, useTransition }} from 'react';

type Item = {{ id: number; name: string }};

export default function ProductosClient({{ data }}: {{ data: Item[] }}) {{
  const [items, setItems] = useState<Item[]>(Array.isArray(data) ? data : []);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const move = (index: number, dir: 'up' | 'down') => {{
    setItems(prev => {{
      const arr = [...prev];
      const to = dir === 'up' ? index - 1 : index + 1;
      if (to < 0 || to >= arr.length) return arr;
      [arr[index], arr[to]] = [arr[to], arr[index]];
      return arr;
    }});
  }};

  async function saveOrder() {{
    setMessage(null);
    try {{
      const ids = items.map(x => x.id);
      const res = await fetch('/api/products/reorder', {{
        method: 'POST',
        headers: {{ 'Content-Type': 'application/json' }},
        body: JSON.stringify({{ ids }}),
      }});
      const json = await res.json();
      if (!res.ok || !json?.ok) throw new Error(json?.error || 'No se pudo guardar el orden');
      setMessage('Orden guardado ✅');
    }} catch (err: any) {{
      setMessage(err?.message || 'Error guardando el orden');
    }}
  }}

  async function remove(id: number) {{
    if (!confirm('¿Eliminar definitivamente?')) return;
    setMessage(null);
    try {{
      const res = await fetch('/api/products/' + id, {{ method: 'DELETE' }});
      const json = await res.json();
      if (!res.ok || !json?.ok) throw new Error(json?.error || 'No se pudo eliminar');
      setItems(prev => prev.filter(x => x.id !== id));
      setMessage('Eliminado ✅');
    }} catch (err: any) {{
      setMessage(err?.message || 'Error eliminando');
    }}
  }}

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Productos</h1>
        <div className="flex items-center gap-2">
          <Link href="/admin/products/new" className="rounded-xl px-4 py-2 border">Nuevo</Link>
          <button
            type="button"
            onClick={() => startTransition(saveOrder)}
            disabled={isPending || items.length === 0}
            className="rounded-xl px-4 py-2 border"
            title="Guardar el orden actual"
          >
            {isPending ? 'Guardando…' : 'Guardar orden'}
          </button>
        </div>
      </div>

      {message && <div className="text-sm">{message}</div>}

      {items.length === 0 && (
        <div className="text-sm opacity-70">No hay datos para mostrar.</div>
      )}

      {items.map((x, i) => (
        <div key={x.id} className="flex items-center gap-2 border rounded-lg px-3 py-2">
          <span className="w-8 text-right font-mono">{i + 1}.</span>
          <span className="flex-1">{x.name}</span>
          <div className="flex gap-1">
            <button type="button" onClick={() => move(i, 'up')} className="rounded-lg px-2 py-1 border" title="Subir">↑</button>
            <button type="button" onClick={() => move(i, 'down')} className="rounded-lg px-2 py-1 border" title="Bajar">↓</button>
            <Link href={"/admin/products/" + x.id} className="rounded-lg px-2 py-1 border" title="Editar">Editar</Link>
            <button type="button" onClick={() => remove(x.id)} className="rounded-lg px-2 py-1 border" title="Eliminar">Eliminar</button>
          </div>
        </div>
      ))}
    </div>
  );
}}
