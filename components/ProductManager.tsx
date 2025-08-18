'use client'

import { useEffect, useState } from 'react'

type Category = { id: number; name: string }
type Product = {
  id: number
  name: string
  description?: string | null
  price: number
  cost: number
  stock: number
  active: boolean
  categoryId: number
}

export default function ProductManager() {
  const [cats, setCats] = useState<Category[]>([])
  const [items, setItems] = useState<Product[]>([])
  const [form, setForm] = useState<Partial<Product>>({ active: true })

  async function load() {
    const [cRes, pRes] = await Promise.all([
      fetch('/api/categories'),
      fetch('/api/products'),
    ])
    setCats(await cRes.json())
    setItems(await pRes.json())
  }

  useEffect(() => { load() }, [])

  function setField<K extends keyof Product>(key: K, value: Product[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function create() {
    const res = await fetch('/api/products', {
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

  async function save(p: Product) {
    const res = await fetch(`/api/products/${p.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(p),
    })
    if (!res.ok) alert('No se pudo guardar')
    load()
  }

  return (
    <div className="section">
      <h2>Productos</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12, maxWidth: 720 }}>
        <div>
          <label>Nombre</label>
          <input value={form.name ?? ''} onChange={e => setField('name', e.target.value)} placeholder="Ej: Hamburguesa Sencilla" />
        </div>
        <div>
          <label>Categoría</label>
          <select value={form.categoryId ?? ''} onChange={e => setField('categoryId', Number(e.target.value) as any)}>
            <option value="" disabled>Selecciona</option>
            {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label>Precio (venta)</label>
          <input type="number" value={form.price ?? ''} onChange={e => setField('price', Number(e.target.value) as any)} placeholder="Ej: 16000" />
        </div>
        <div>
          <label>Costo</label>
          <input type="number" value={form.cost ?? ''} onChange={e => setField('cost', Number(e.target.value) as any)} placeholder="Ej: 8000" />
        </div>
        <div>
          <label>Stock</label>
          <input type="number" value={form.stock ?? ''} onChange={e => setField('stock', Number(e.target.value) as any)} placeholder="Ej: 50" />
        </div>
        <div>
          <label>Activo</label>
          <input type="checkbox" checked={!!form.active} onChange={e => setField('active', e.target.checked as any)} /> Visible
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label>Descripción</label>
          <textarea value={form.description ?? ''} onChange={e => setField('description', e.target.value as any)} placeholder="Descripción" />
        </div>
      </div>
      <button style={{ marginTop: 8 }} onClick={create}>Crear producto</button>

      <h3 style={{ marginTop: 20 }}>Lista</h3>
      <table>
        <thead>
          <tr><th>Nombre</th><th>Precio</th><th>Costo</th><th>Stock</th><th>Activo</th><th>Categoría</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {items.map(p => (
            <tr key={p.id}>
              <td><input defaultValue={p.name} onBlur={e => save({ ...p, name: e.currentTarget.value })} /></td>
              <td><input type="number" defaultValue={p.price} onBlur={e => save({ ...p, price: Number(e.currentTarget.value) })} /></td>
              <td><input type="number" defaultValue={p.cost} onBlur={e => save({ ...p, cost: Number(e.currentTarget.value) })} /></td>
              <td><input type="number" defaultValue={p.stock} onBlur={e => save({ ...p, stock: Number(e.currentTarget.value) })} /></td>
              <td><input type="checkbox" defaultChecked={p.active} onChange={e => save({ ...p, active: e.currentTarget.checked })} /></td>
              <td>
                <select defaultValue={p.categoryId} onChange={e => save({ ...p, categoryId: Number(e.currentTarget.value) })}>
                  {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </td>
              <td className="actions">{/* add delete if needed */}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
