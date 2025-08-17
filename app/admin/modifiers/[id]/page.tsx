
import { prisma } from '@/lib/prisma';
export default async function Page({ params }: { params: { id: string } }){
  const id = Number(params.id);
  const m = await prisma.modifier.findUnique({ where: { id } });
  if (!m) return <div className="card">Adicional no encontrado</div>;
  return (
    <form id="form-with-autosave" className="card" action={`/api/modifiers/${id}`} method="post" encType="multipart/form-data">
      <input type="hidden" name="_method" value="PUT"/>
      <h1>Editar adicional</h1>
      <div className="mt-3"><input className="input" name="name" defaultValue={m.name} required /></div>
      <div className="grid grid-3" style={{gap:12, marginTop:12}}>
        <input className="input" name="priceDelta" defaultValue={m.priceDelta} />
        <input className="input" name="costDelta" defaultValue={m.costDelta} />
        <input className="input" name="stock" defaultValue={m.stock} />
      </div>
      <div className="section"><input type="file" name="image" accept="image/*" /></div>
      <div className="section"><button className="btn btn-primary" type="submit">Guardar</button></div>
    </form>
  );
}
