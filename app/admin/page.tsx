
import Link from 'next/link';
export default function AdminHome() {
  return (
    <div className="grid" style={{gap:16}}>
      <div className="card"><h1>Panel de administración</h1><p className="muted">Gestiona productos, adicionales y categorías.</p></div>
      <div className="grid grid-3">
        <div className="card"><h3>Productos</h3><p className="muted">Crear/editar/eliminar productos.</p><Link className="btn btn-primary" href="/admin/products">Entrar</Link></div>
        <div className="card"><h3>Adicionales</h3><p className="muted">Gestiona los adicionales.</p><Link className="btn btn-primary" href="/admin/modifiers">Entrar</Link></div>
        <div className="card"><h3>Categorías</h3><p className="muted">Organiza tu menú.</p><Link className="btn btn-primary" href="/admin/categories">Entrar</Link></div>
      </div>
    </div>
  );
}
