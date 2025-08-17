
import { prisma } from '@/lib/prisma';
export default async function Page({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const product = await prisma.product.findUnique({ where: { id }, include: { category: true } });
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  if (!product) return <div className="card">Producto no encontrado</div>;
  return (
    <form id="form-with-autosave" className="card" action={`/api/products/${id}`} method="post" encType="multipart/form-data">
      <input type="hidden" name="_method" value="PUT"/>
      <h1>Editar producto</h1>
      <div className="grid grid-3" style={{gap:12}}>
        <input className="input" name="name" defaultValue={product.name} required />
        <input className="input" name="price" defaultValue={product.price} type="number" required />
        <input className="input" name="cost" defaultValue={product.cost} type="number" required />
      </div>
      <div className="grid grid-2" style={{gap:12, marginTop:12}}>
        <input className="input" name="stock" defaultValue={product.stock} type="number" />
        <select className="input" name="categoryId" defaultValue={product.categoryId} required>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div className="section"><textarea className="input" name="description" defaultValue={product.description ?? ''} placeholder="Descripción" /></div>
      <div className="section"><input type="file" name="image" accept="image/*" /></div>
      <div className="section"><button className="btn btn-primary" type="submit">Guardar</button></div>
    </form>
  );
}
