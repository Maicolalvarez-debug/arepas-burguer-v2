// app/admin/categories/CategoriesClient.tsx
'use client';

import { useState, useTransition } from 'react';
import type { Category } from '@prisma/client';

export default function CategoriesClient({ data }: { data: Category[] }) {
  const [items, setItems] = useState<Category[]>(Array.isArray(data) ? data : []);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const move = (index: number, dir: 'up' | 'down') => {
    setItems(prev => {
      const arr = [...prev];
      const to = dir === 'up' ? index - 1 : index + 1;
      if (to < 0 || to >= arr.length) return arr;
      [arr[index], arr[to]] = [arr[to], arr[index]];
      return arr;
    });
  };

  async function saveOrder() {
    setMessage(null);
    try {
      const ids = items.map(x => x.id); // number[] si id es Int, string[] si es String, Prisma lo define
      const res = await fetch('/api/categories/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });
      const json = await res.json();
      if (!res.ok || !json?.ok) {
        throw new Error(json?.error || 'No se pudo guardar el orden');
      }
      setMessage('Orden guardado ✅');
    } catch (err: any) {
      setMessage(err?.message || 'Error guardando el orden');
    }
  }

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Categorías</h1>
        <div className="flex items-center gap-2">
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
        <div className="text-sm opacity-70">No hay categorías para mostrar.</div>
      )}

      {items.map((c, i) => (
        <div key={c.id} className="flex items-center gap-2 border rounded-lg px-3 py-2">
          <span className="w-8 text-right font-mono">{i + 1}.</span>
          <span className="flex-1">{c.name}</span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => move(i, 'up')}
              className="rounded-lg px-2 py-1 border"
              aria-label="Subir"
              title="Subir"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => move(i, 'down')}
              className="rounded-lg px-2 py-1 border"
              aria-label="Bajar"
              title="Bajar"
            >
              ↓
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
