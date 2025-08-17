import { prisma } from '@/lib/prisma';
import ImageCropper from '@/components/ImageCropper';
import FormAutosave from '@/components/FormAutosave';

export default async function EditModifier({ params }: { params: { id: string }}){
  const id = Number(params.id);
  const m = await prisma.modifier.findUnique({ where: { id } });
  if (!m) return <div className="card">Adicional no encontrado</div>;
  return (
    <form id="form-with-autosave" className="card" action={`/api/modifiers/${id}`} method="post" encType="multipart/form-data">
      <input type="hidden" name="_method" value="PUT"/>
      <h1>Editar adicional</h1>
      <div className="mt-3"><input className="input" name="name" defaultValue={m.name} required /></div>
      <div className="mt-3"><input className="input" name="priceDelta" defaultValue={m.priceDelta} required /></div>
      <div className="mt-3"><input className="input" name="costDelta" defaultValue={m.costDelta ?? 0} /></div>
      <div className="mt-3"><input className="input" name="imageUrl" defaultValue={m.imageUrl ?? ''} /></div>
      <input type="hidden" name="imageCropped" id="imageCropped" />
      <ImageCropper aspect=1 minWidth=400 minHeight=400 allowCamera aspect={1} allowCamera initialImageUrl={m.imageUrl || undefined} onCropped={(data)=>{
        const el = document.getElementById('imageCropped') as HTMLInputElement;
        if (el) el.value = data;
      }}/>
      <button className="btn mt-3" type="submit">Guardar cambios</button>
    <FormAutosave formId="form-with-autosave" storageKey="draft-autosave" />
    </form>
  )
}
