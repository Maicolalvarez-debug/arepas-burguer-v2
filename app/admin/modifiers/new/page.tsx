import ImageCropper from '@/components/ImageCropper';
import FormAutosave from '@/components/FormAutosave';

export default async function NewModifier(){
  return (
    <form id="form-with-autosave" className="card" action="/api/modifiers" method="post" encType="multipart/form-data">
      <h1>Nuevo adicional</h1>
      <div className="mt-3"><input className="input" name="name" placeholder="Nombre" required /></div>
      <div className="mt-3"><input className="input" name="priceDelta" placeholder="Precio extra (número)" required /></div>
      <div className="mt-3"><input className="input" name="costDelta" placeholder="Costo extra (número)" defaultValue="0" /></div>
      <div className="mt-3"><input className="input" name="imageUrl" placeholder="URL de imagen (opcional)" /></div>
      <input type="hidden" name="imageCropped" id="imageCropped" />
      <ImageCropper aspect=1 minWidth=400 minHeight=400 allowCamera aspect={1} allowCamera onCropped={(data)=>{
        const el = document.getElementById('imageCropped') as HTMLInputElement;
        if (el) el.value = data;
      }}/>
      <button className="btn mt-3" type="submit">Guardar</button>
    <FormAutosave formId="form-with-autosave" storageKey="draft-autosave" />
    </form>
  )
}
