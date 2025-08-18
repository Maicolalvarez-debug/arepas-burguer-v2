// app/admin/page.tsx
export default function AdminHome() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Admin</h1>
      <ul>
        <li><a href="/admin/products">Productos</a></li>
        <li><a href="/admin/categories">Categorías</a></li>
        <li><a href="/admin/modifiers">Modificadores</a></li>
      </ul>
    </div>
  )
}
