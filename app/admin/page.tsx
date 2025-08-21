import Link from 'next/link';
export default function AdminHome(){
  return <div className="space-y-4">
    <div className="flex items-center justify-between"><h1 className="text-2xl font-semibold">Administración</h1><a className="text-sm underline" href="/api/admin/logout">Salir</a></div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <Link className="card" href="/admin/products">Productos</Link>
      <Link className="card" href="/admin/categories">Categorías</Link>
      <Link className="card" href="/admin/modifiers">Modificadores</Link>
      <Link className="card" href="/admin/qr">QR Mesas</Link>
    <Link className="card" href="/admin/reports">Informes</Link>
      <Link className="card" href="/admin/receipts">Recibos</Link>
      <Link className="card" href="/admin/promo">Promo del día</Link>
          <Link className="card" href="/admin/orders">Órdenes</Link>
    </div>
  </div>;
}
