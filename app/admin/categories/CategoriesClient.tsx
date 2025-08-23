'use client'
import Link from 'next/link'
import { useState } from 'react'

type Item = { id: number; name: string }

export default function CategoriesClient({ data }: { data: Item[] }) {
  const [items, setItems] = useState<Item[]>(Array.isArray(data) ? data : [])

  async function remove(id: number) {
    if (!confirm('¿Eliminar definitivamente?')) return
    const res = await fetch('/api/categories/' + id, { method: 'DELETE' })
    const json = await res.json()
    if (!res.ok || !json?.ok) {
      alert(json?.error || 'No se pudo eliminar')
      return
    }
    setItems(prev => prev.filter(x=>x.id!==id))
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Link href="/admin/categories/new" className="border rounded px-3 py-1">Nueva categoría</Link>
      </div>
      {items.map((x)=>(
        <div key={x.id} className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-gray-900 border-gray-700 text-white">
          <span className="flex-1">{x.name}</span>
          <Link href={`/admin/categories/${x.id}`} className="rounded-lg px-2 py-1 border">Editar</Link>
          <button type="button" onClick={() => remove(x.id)} className="rounded-lg px-2 py-1 border">Eliminar</button>
        </div>
      ))}
      {!items.length && <div className="opacity-60">Sin categorías.</div>}
    </div>
  )
}
