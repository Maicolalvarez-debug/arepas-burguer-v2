'use client'

import { useEffect, useState } from 'react'

type Modifier = { id: number; name: string; priceDelta: number; costDelta: number; stock: number; active: boolean }

export default function ModifierManager() {
  const [items, setItems] = useState<Modifier[]>([])
  const [form, setForm] = useState<Partial<Modifier>>({ active: true })

  async function load() {
    const res = await fetch('/api/modifiers')
    setItems(await res.json())
  }
  useEffect(() => { load() }, [])

  function setField<K extends keyof Modifier>(key: K, value: Modifier[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function create() {
    const res = await fetch('/api/modifiers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (!res.ok) {
      const t = await res.text()
      alert(t || 'Error al crear')
      return
    }
    setForm({ active: true })
    load()
  }

  async function save(m: Modifier) {
    const res = await fetch(`/api/modifiers/${m.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(m),
    })
    if (!res.ok) alert('No se pudo guardar')
    load()
  }

  return (
    <div className="section">
      <h2>Modificadores</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 12, maxWidth: 720 }}>
        <div>
          <label>Nombre</label>
          <input value={form.name ?? ''} onChange={e => setField('name', e.target.value)} placeholder="Ej: Extra queso" />
        </div>
        <div>
          <label>Δ Precio</label>
          <input type="number" value={form.priceDelta ?? ''} onChange={e => setField('priceDelta', Number(e.target.value) as any)} placeholder="Ej: 2000" />
        </div>
        <div>
          <label>Δ Costo</label>
          <input type="number" value={form.costDelta ?? ''} onChange={e => setField('costDelta', Number(e.target.value) as any)} placeholder="Ej: 1000" />
        </div>
        <div>
          <label>Stock</label>
          <input type="number" value={form.stock ?? ''} onChange={e => setField('stock', Number(e.target.value) as any)} placeholder="Ej: 100" />
        </div>
        <div>
          <label>Activo</label>
          <input type="checkbox" checked={!!form.active} onChange={e => setField('active', e.target.checked as any)} /> Visible
        </div>
      </div>
      <button style={{ marginTop: 8 }} onClick={create}>Crear modificador</button>

      <h3 style={{ marginTop: 20 }}>Lista</h3>
      <table>
        <thead>
          <tr><th>Nombre</th><th>Δ Precio</th><th>Δ Costo</th><th>Stock</th><th>Activo</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {items.map(m => (
            <tr key={m.id}>
              <td><input defaultValue={m.name} onBlur={e => save({ ...m, name: e.currentTarget.value })} /></td>
              <td><input type="number" defaultValue={m.priceDelta} onBlur={e => save({ ...m, priceDelta: Number(e.currentTarget.value) })} /></td>
              <td><input type="number" defaultValue={m.costDelta} onBlur={e => save({ ...m, costDelta: Number(e.currentTarget.value) })} /></td>
              <td><input type="number" defaultValue={m.stock} onBlur={e => save({ ...m, stock: Number(e.currentTarget.value) })} /></td>
              <td><input type="checkbox" defaultChecked={m.active} onChange={e => save({ ...m, active: e.currentTarget.checked })} /></td>
              <td className="actions">{/* add delete if desired */}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
