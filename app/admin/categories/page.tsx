
import Link from 'next/link'; import { prisma } from '@/lib/prisma';
export default async function AdminCategories(){
  const cats = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  return (
    <div className="grid" style={{gap:16}}>
      <div className="card" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h1>Categorías</h1>
        <Link className="btn btn-primary" href="/admin/categories/new">Nueva categoría</Link>
      </div>
      <div className="card">
        <table style={{width:'100%', borderCollapse:'collapse'}}>
          <thead><tr><th align="left">Nombre</th><th></th></tr></thead>
          <tbody>
            {cats.map(c => (
              <tr key={c.id} style={{borderTop:'1px solid var(--border)'}}>
                <td>{c.name}</td>
                <td align="right">
                  <form style={{display:'inline-block'}} action={`/api/categories/${c.id}`} method="post">
                    <input className="input" type="text" name="name" defaultValue={c.name} />
                    <input type="hidden" name="_method" value="PUT"/>
                    <button className="btn" type="submit" style={{marginLeft:8}}>Renombrar</button>
                  </form>
                  <form style={{display:'inline-block', marginLeft:8}} action={`/api/categories/${c.id}`} method="post">
                    <input type="hidden" name="_method" value="DELETE"/>
                    <button className="btn btn-danger" type="submit">Eliminar</button>
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
