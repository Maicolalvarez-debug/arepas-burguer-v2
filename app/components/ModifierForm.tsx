// app/components/ModifierForm.tsx
'use client'
import { useState } from 'react'

export default function ModifierForm({ modifier }: { modifier?: any }) {
  const [saving, setSaving] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    const fd = new FormData(e.currentTarget)

    const payload = {
      name: fd.get('name'),
      priceDelta: fd.get('priceDelta'),
      costDelta: fd.get('costDelta'),
      stock: fd.get('stock'),
      active: fd.get('active') ? true : false,
    }

    const url = modifier ? `/api/modifiers/${modifier.id}` : '/api/modifiers'
    const method = modifier ? 'PATCH' : 'POST'

    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    setSaving(false)
    if (!res.ok) { alert('No se pudo guardar'); return }
    alert('Guardado')
  }

  return (
    <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8, maxWidth: 480 }}>
      <label>Nombre</label>
      <input name="name" defaultValue={modifier?.name ?? ''} required />

      <label>Precio (+/-)</label>
      <input type="number" name="priceDelta" defaultValue={modifier?.priceDelta ?? ''} placeholder="Ej: 1000" step={1} required />

      <label>Costo (+/-)</label>
      <input type="number" name="costDelta" defaultValue={modifier?.costDelta ?? ''} placeholder="Ej: 700" step={1} required />

      <label>Stock</label>
      <input type="number" name="stock" defaultValue={modifier?.stock ?? ''} placeholder="Ej: 50" step={1} required />

      <label><input type="checkbox" name="active" defaultChecked={modifier?.active ?? true} /> Activo</label>

      <button type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
    </form>
  )
}
