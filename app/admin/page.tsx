import Link from 'next/link';
import AdminNotifier from '@/components/AdminNotifier';

export default function Admin(){
  return (
    <div className="card">
      <h1>Administración</h1>
      <div className="mt-3">
        <Link className="btn" href="/admin/products">Productos</Link>
        <span style={{marginLeft:8}} />
        <Link className="btn" href="/admin/categories">Categorías</Link>
        <span style={{marginLeft:8}} />
        <Link className="btn" href="/admin/modifiers">Adicionales</Link>
        <span style={{marginLeft:8}} />
        <Link className="btn" href="/admin/qr">QR por mesa</Link>
      <AdminNotifier />
    </div>
    <AdminNotifier />
    </div>
  )
}
