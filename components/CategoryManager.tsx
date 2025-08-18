'use client'

import { useEffect, useState } from 'react'

type Category = { id: number; name: string; order: number }

export default function CategoryManager() {
  const [items, setItems] = useState<Category[]>([])
  const [name, setName] = useState('')
  const [dragId, setDragId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    const res = await fetch('/api/categories')
    const data = await res.json()
    setItems(data)
  }

  useEffect(() => {
    load()
  }, [])

  async function create() {
    setError(null)
    setLoading(true)
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    setLoading(false)
    if (!res.ok) {
      const t = await res.text()
      setError(t || 'Error al crear')
      return
    }
    setName('')
    load()
  }

  async function saveName(id: number, name: string) {
    const res = await fetch(`/api/categories/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    if (!res.ok) alert('No se pudo guardar')
    load()
  }

  function onDragStart(id: number) {
    setDragId(id)
  }
  function onDragOver(e: React.DragEvent<HTMLTableRowElement>) {
    e.preventDefault()
  }
  function onDrop(targetId: number) {
    if (dragId == null || dragId === targetId) return
    const old = [...items]
    const dragged = old.find(i => i.id === dragId)!
    const target = old.find(i => i.id === targetId)!
    const draggedIdx = old.indexOf(dragged)
    const targetIdx = old.indexOf(target)
    old.splice(draggedIdx, 1)
    old.splice(targetIdx, 0, dragged)
    setItems(old)
    setDragId(null)
  }

  async function saveOrder() {
    const ids = items.map(i => i.id)
    const res = await fetch('/api/categories/reorder', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    })
    if (!res.ok) alert('No se pudo guardar el orden')
    else alert('Orden guardado')
    load()
  }

  return (
    <div className="section">
      <h2>Categorías</h2>

      <div style={{ maxWidth: 420 }}>
        <label>Nombre</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Hamburguesas" />
        <button disabled={!name || loading} onClick={create}>Crear</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>

      <table style={{ marginTop: 16 }}>
        <thead>
          <tr><th>Orden</th><th>Nombre</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {items.map((c, idx) => (
            <tr key={c.id}
                draggable
                onDragStart={() => onDragStart(c.id)}
                onDragOver={onDragOver}
                onDrop={() => onDrop(c.id)}>
              <td>{idx + 1}</td>
              <td>
                <input defaultValue={c.name} onBlur={e => saveName(c.id, e.currentTarget.value)} />
              </td>
              <td className="actions">
                {/* Add delete if desired */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button style={{ marginTop: 12 }} onClick={saveOrder}>Guardar orden</button>
    </div>
  )
}
