// app/admin/products/page.tsx
'use client'
import { useEffect, useState } from 'react'
import ProductoForm from '../../components/ProductoForm'

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])

  async function load() {
    const ps = await fetch('/api/products').then(r => r.json())
    const cs = await fetch('/api/categories').then(r => r.json())
    setProducts(ps); setCategories(cs)
  }

  useEffect(() => { load() }, [])

  return (
    <div style={{ padding: 20 }}>
      <h1>Productos</h1>
      <h3>Crear nuevo</h3>
      <ProductoForm categories={categories} />

      <h3 style={{ marginTop: 24 }}>Listado</h3>
      <table border={1} cellPadding={6}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Costo</th>
            <th>Stock</th>
            <th>Activo</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.cost}</td>
              <td>{p.stock}</td>
              <td>{String(p.active)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
