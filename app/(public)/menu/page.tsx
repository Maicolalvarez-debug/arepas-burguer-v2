
import { prisma } from '@/lib/prisma'; import Image from 'next/image';
export const revalidate = 0;
export default async function MenuPage(){
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' }, include: { products: { where: { active: true }, orderBy: { order: 'asc' } } } });
  return (
    <div>
      <h1>Menú</h1>
      {categories.map(c => (
        <div key={c.id} className="menu-category">
          <h2>{c.name} <span className="badge">{c.products.length} ítems</span></h2>
          <div className="menu-items">
            {c.products.map(p => (
              <div key={p.id} className="menu-item">
                <Image src={p.imageUrl || '/logo.png'} alt={p.name} width={400} height={300} />
                <div className="info">
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <strong>{p.name}</strong><span className="price">${p.price}</span>
                  </div>
                  {p.description ? <div className="muted">{p.description}</div> : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
