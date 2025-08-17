import { prisma } from '@/lib/prisma';
import ImageCropper from '@/components/ImageCropper';
import FormAutosave from '@/components/FormAutosave';

export default async function NewProduct(){
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  return (
    <form id="form-with-autosave" className="card" action="/api/products" method="post" encType="multipart/form-data">
      <h1>Nuevo producto</h1>
      <div className="mt-3"><input className="input" name="name" placeholder="Nombre" required /></div>
      <div className="mt-3"><input className="input" name="price" placeholder="Precio (número)" required /></div>
      <div className="mt-3"><input className="input" name="cost" placeholder="Costo (número)" /></div>
      <div className="mt-3"><input className="input" name="imageUrl" placeholder="URL de imagen (opcional)" /></div>
      <input type="hidden" name="imageCropped" id="imageCropped" />
      <ImageCropper aspect=4/3 minWidth=800 minHeight=600 watermark={ enabledByDefault: true, logoUrl: "/logo.png", opacity: 0.15, scale: 0.18, corner: "br", margin: 12 } allowCamera aspect={4/3} allowCamera onCropped={(data)=>{
        const el = document.getElementById('imageCropped') as HTMLInputElement;
        if (el) el.value = data;
      }}/>
      <div className="mt-3">
        <select className="input" name="categoryId" required>
          <option value="">-- Categoría --</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <button className="btn mt-3" type="submit">Guardar</button>
    <FormAutosave formId="form-with-autosave" storageKey="draft-autosave" />
    </form>
  )
}
