
import { prisma } from '@/lib/prisma';
export default async function NewProduct() {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  return (
    <form className="card" action="/api/products" method="post" encType="multipart/form-data">
      <h1>Nuevo producto</h1>
      <div className="grid grid-3" style={{gap:12}}>
        <input className="input" name="name" placeholder="Nombre" required />
        <input className="input" name="price" placeholder="Precio" type="number" required />
        <input className="input" name="cost" placeholder="Costo" type="number" required />
      </div>
      <div className="grid grid-2" style={{gap:12, marginTop:12}}>
        <input className="input" name="stock" placeholder="Stock" type="number" />
        <select className="input" name="categoryId" required defaultValue="">
          <option value="" disabled>Selecciona categoría</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div className="section"><textarea className="input" name="description" placeholder="Descripción (opcional)"/></div>
      <div className="section"><input type="file" name="image" accept="image/*" /></div>
      <div className="section"><button className="btn btn-primary" type="submit">Crear</button></div>
    </form>
  );
}
