import { prisma } from '@/lib/prisma';
import ImageCropper from '@/components/ImageCropper';
import FormAutosave from '@/components/FormAutosave';

export default async function EditProduct({ params }: { params: { id: string }}){
  const id = Number(params.id);
  const product = await prisma.product.findUnique({ where: { id } });
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  if (!product) return <div className="card">Producto no encontrado</div>;
  return (
    <form id="form-with-autosave" className="card" action={`/api/products/${id}`} method="post" encType="multipart/form-data">
      <input type="hidden" name="_method" value="PUT"/>
      <h1>Editar producto</h1>
      <div className="mt-3"><input className="input" name="name" defaultValue={product.name} required /></div>
      <div className="mt-3"><input className="input" name="price" defaultValue={product.price} required /></div>
      <div className="mt-3"><input className="input" name="cost" defaultValue={product.cost ?? 0} /></div>
      <div className="mt-3"><input className="input" name="imageUrl" defaultValue={product.imageUrl ?? ''} /></div>
      <input type="hidden" name="imageCropped" id="imageCropped" />
      <ImageCropper aspect=4/3 minWidth=800 minHeight=600 watermark={ enabledByDefault: true, logoUrl: "/logo.png", opacity: 0.15, scale: 0.18, corner: "br", margin: 12 } allowCamera aspect={4/3} allowCamera initialImageUrl={product.imageUrl || undefined} onCropped={(data)=>{
        const el = document.getElementById('imageCropped') as HTMLInputElement;
        if (el) el.value = data;
      }}/>
      <div className="mt-3">
        <select className="input" name="categoryId" defaultValue={product.categoryId} required>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <button className="btn mt-3" type="submit">Guardar cambios</button>
    <FormAutosave formId="form-with-autosave" storageKey="draft-autosave" />
    </form>
  )
}
