import { prisma } from "@/lib/prisma";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const product = await prisma.product.findUnique({ where: { id } });
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  if (!product) {
    return <div className="card">Producto no encontrado</div>;
  }

  return (
    <form
      id="form-with-autosave"
      className="card"
      action={`/api/products/${id}`}
      method="post"
      encType="multipart/form-data"
    >
      <input type="hidden" name="_method" value="PUT" />
      <h1>Editar producto</h1>

      <div className="mt-3">
        <input className="input" name="name" defaultValue={product.name} required />
      </div>

      <div className="mt-3">
        <input className="input" name="price" type="number" defaultValue={product.price} required />
      </div>

      <div className="mt-3">
        <select className="input" name="categoryId" defaultValue={product.categoryId ?? ""} required>
          <option value="" disabled>Elige una categoría</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <button className="btn mt-4" type="submit">Guardar</button>
    </form>
  );
}
