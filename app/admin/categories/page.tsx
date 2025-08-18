import { prisma } from '@/lib/prisma';

export default async function Categories(){
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  return (
    <div>
      <div className="card">
        <h1>Categorías</h1>
        <form className="mt-3" action="/api/categories" method="post">
          <div className="flex gap-3">
            <input name="name" className="input" placeholder="Nueva categoría" required />
            <button className="btn">Agregar</button>
          </div>
        </form>
      </div>
      <div className="mt-3">
        {categories.map(c => (
          <div key={c.id} className="card mt-2">
            <div className="flex items-center justify-between">
              <div>{c.name}</div>
              <form action={`/api/categories/${c.id}`} method="post">
                <input type="hidden" name="_method" value="DELETE"/>
                <button className="btn" style={{background:'#ef4444'}}>Eliminar</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
