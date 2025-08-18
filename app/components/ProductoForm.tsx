// app/components/ProductoForm.tsx
'use client'
import { useState } from 'react'

export default function ProductoForm({ product, categories }: { product?: any; categories: any[] }) {
  const [saving, setSaving] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    const fd = new FormData(e.currentTarget)

    const payload = {
      name: fd.get('name'),
      description: fd.get('description'),
      categoryId: Number(fd.get('categoryId')),
      price: fd.get('price'),
      cost: fd.get('cost'),
      stock: fd.get('stock'),
      active: fd.get('active') ? true : false,
    }

    const url = product ? `/api/products/${product.id}` : '/api/products'
    const method = product ? 'PATCH' : 'POST'

    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    setSaving(false)
    if (!res.ok) { alert('No se pudo guardar'); return }
    alert('Guardado')
  }

  return (
    <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8, maxWidth: 480 }}>
      <label>Nombre</label>
      <input name="name" defaultValue={product?.name ?? ''} required />

      <label>Descripción</label>
      <textarea name="description" defaultValue={product?.description ?? ''} />

      <label>Categoría</label>
      <select name="categoryId" defaultValue={product?.categoryId ?? ''} required>
        <option value="" disabled>Seleccione...</option>
        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>

      <label>Precio</label>
      <input type="number" name="price" defaultValue={product?.price ?? ''} placeholder="Ej: 16000" min={0} step={1} required />

      <label>Costo</label>
      <input type="number" name="cost" defaultValue={product?.cost ?? ''} placeholder="Ej: 8000" min={0} step={1} required />

      <label>Stock</label>
      <input type="number" name="stock" defaultValue={product?.stock ?? ''} placeholder="Ej: 50" min={0} step={1} required />

      <label><input type="checkbox" name="active" defaultChecked={product?.active ?? true} /> Activo</label>

      <button type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
    </form>
  )
}
