
import Link from 'next/link'; import { prisma } from '@/lib/prisma';
export default async function AdminModifiers() {
  const mods = await prisma.modifier.findMany({ orderBy: { name: 'asc' } });
  return (
    <div className="grid" style={{gap:16}}>
      <div className="card" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h1>Adicionales</h1>
        <Link className="btn btn-primary" href="/admin/modifiers/new">Nuevo adicional</Link>
      </div>
      <div className="card">
        <table style={{width:'100%', borderCollapse:'collapse'}}>
          <thead><tr><th align="left">Nombre</th><th>Precio</th><th>Stock</th><th></th></tr></thead>
          <tbody>
            {mods.map(m => (
              <tr key={m.id} style={{borderTop:'1px solid var(--border)'}}>
                <td>{m.name}</td><td align="center">${m.priceDelta}</td><td align="center">{m.stock}</td>
                <td align="right">
                  <Link className="btn" href={`/admin/modifiers/${m.id}`}>Editar</Link>
                  <form style={{display:'inline-block', marginLeft:8}} action={`/api/modifiers/${m.id}`} method="post">
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
