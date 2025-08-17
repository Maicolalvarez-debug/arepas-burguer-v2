
import Link from 'next/link'; import { prisma } from '@/lib/prisma';
export default async function AdminProducts() {
  const products = await prisma.product.findMany({ include:{ category:true }, orderBy:[{ category:{ name:'asc' }},{ order:'asc' },{ name:'asc' }] });
  return (
    <div className="grid" style={{gap:16}}>
      <div className="card" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h1>Productos</h1>
        <Link className="btn btn-primary" href="/admin/products/new">Nuevo producto</Link>
      </div>
      <div className="card">
        <table style={{width:'100%', borderCollapse:'collapse'}}>
          <thead><tr><th align="left">Nombre</th><th align="left">Categoría</th><th>Precio</th><th>Stock</th><th>Activo</th><th></th></tr></thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} style={{borderTop:'1px solid var(--border)'}}>
                <td>{p.name}</td><td className="muted">{p.category?.name ?? '-'}</td><td align="center"><span className="badge">${p.price}</span></td>
                <td align="center">{p.stock}</td><td align="center">{p.active ? 'Sí' : 'No'}</td>
                <td align="right">
                  <Link className="btn" href={`/admin/products/${p.id}`}>Editar</Link>
                  <form style={{display:'inline-block', marginLeft:8}} action={`/api/products/${p.id}`} method="post">
                    <input type="hidden" name="_method" value="DELETE"/><button className="btn btn-danger" type="submit">Eliminar</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
