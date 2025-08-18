import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function Modifiers(){
  const modifiers = await prisma.modifier.findMany({ orderBy: { name: 'asc' } });
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1>Adicionales</h1>
        <Link className="btn" href="/admin/modifiers/new">Nuevo</Link>
      </div>
      <div className="mt-3">
        {modifiers.map(m => (
          <div key={m.id} className="card mt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {m.imageUrl ? <img src={m.imageUrl} width={36} height={36} style={{borderRadius:8}} alt={m.name}/> : <div className="badge">sin img</div>}
                <div><b>{m.name}</b> — +${m.priceDelta.toLocaleString()}</div>
              </div>
              <div className="flex gap-2">
                <Link className="btn" href={`/admin/modifiers/${m.id}`}>Editar</Link>
                <form action={`/api/modifiers/${m.id}`} method="post">
                  <input type="hidden" name="_method" value="DELETE"/>
                  <button className="btn" style={{background:'#ef4444'}}>Eliminar</button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
