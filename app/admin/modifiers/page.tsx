// app/admin/modifiers/page.tsx
'use client'
import { useEffect, useState } from 'react'
import ModifierForm from '../../components/ModifierForm'

export default function ModifiersPage() {
  const [mods, setMods] = useState<any[]>([])

  async function load() {
    const data = await fetch('/api/modifiers').then(r => r.json())
    setMods(data)
  }

  useEffect(() => { load() }, [])

  return (
    <div style={{ padding: 20 }}>
      <h1>Modificadores</h1>
      <h3>Crear nuevo</h3>
      <ModifierForm />

      <h3 style={{ marginTop: 24 }}>Listado</h3>
      <table border={1} cellPadding={6}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio +/-</th>
            <th>Costo +/-</th>
            <th>Stock</th>
            <th>Activo</th>
          </tr>
        </thead>
        <tbody>
          {mods.map((m) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.name}</td>
              <td>{m.priceDelta}</td>
              <td>{m.costDelta}</td>
              <td>{m.stock}</td>
              <td>{String(m.active)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
