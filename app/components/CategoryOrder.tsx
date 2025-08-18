// app/components/CategoryOrder.tsx
'use client'
import { useEffect, useState } from 'react'

export default function CategoryOrder() {
  const [cats, setCats] = useState<any[]>([])
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  async function load() {
    const data = await fetch('/api/categories').then(r => r.json())
    setCats(data)
  }
  useEffect(() => { load() }, [])

  function onDragStart(i: number) { setDragIndex(i) }
  function onDragOver(e: React.DragEvent) { e.preventDefault() }
  function onDrop(i: number) {
    if (dragIndex === null || dragIndex === i) return
    const copy = [...cats]
    const [moved] = copy.splice(dragIndex, 1)
    copy.splice(i, 0, moved)
    setCats(copy)
    setDragIndex(null)
  }

  async function saveOrder() {
    const ids = cats.map(c => c.id)
    const res = await fetch('/api/categories/reorder', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    })
    if (res.status === 501) {
      alert('El reordenamiento no está soportado en este esquema. (Funciona igual, solo no guarda el orden.)')
      return
    }
    if (!res.ok) alert('No se pudo guardar el orden'); else alert('Orden guardado')
  }

  return (
    <div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {cats.map((c, i) => (
          <li key={c.id}
              draggable
              onDragStart={() => onDragStart(i)}
              onDragOver={onDragOver}
              onDrop={() => onDrop(i)}
              style={{ padding: 8, border: '1px solid #ddd', marginBottom: 6, cursor: 'grab', background: 'white' }}>
            {i + 1}. {c.name}
          </li>
        ))}
      </ul>
      <button onClick={saveOrder}>Guardar orden</button>
    </div>
  )
}
