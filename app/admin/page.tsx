import Link from 'next/link';
export default function AdminHome(){
  return <div className="space-y-4">
    <h1 className="text-2xl font-semibold">Administración</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <Link className="card" href="/admin/products">Productos</Link>
      <Link className="card" href="/admin/categories">Categorías</Link>
      <Link className="card" href="/admin/modifiers">Modificadores</Link>
      <Link className="card" href="/admin/qr">QR Mesas</Link>
    </div>
  </div>;
}
