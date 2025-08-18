// app/admin/categories/page.tsx
'use client'
import { useEffect, useState } from 'react'
import CategoryOrder from '../../components/CategoryOrder'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [name, setName] = useState('')

  async function load() {
    const data = await fetch('/api/categories').then(r => r.json())
    setCategories(data)
  }

  useEffect(() => { load() }, [])

  async function createCategory(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    if (!res.ok) return alert('No se pudo crear')
    setName('')
    await load()
  }

  async function rename(id: number) {
    const newName = prompt('Nuevo nombre:')
    if (!newName) return
    const res = await fetch(`/api/categories/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName }),
    })
    if (!res.ok) return alert('No se pudo editar')
    await load()
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Categorías</h1>

      <form onSubmit={createCategory} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre" />
        <button type="submit">Crear</button>
      </form>

      <table border={1} cellPadding={6} style={{ marginBottom: 24 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c: any) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td><button onClick={() => rename(c.id)}>Renombrar</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Ordenar (si el esquema lo soporta)</h3>
      <CategoryOrder />
    </div>
  )
}
