import { prisma } from "@/lib/prisma";

export default async function EditModifierPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const m = await prisma.modifier.findUnique({ where: { id } });

  if (!m) {
    return <div className="card">Adicional no encontrado</div>;
  }

  return (
    <form
      id="form-with-autosave"
      className="card"
      action={`/api/modifiers/${id}`}
      method="post"
      encType="multipart/form-data"
    >
      <input type="hidden" name="_method" value="PUT" />
      <h1>Editar adicional</h1>

      <div className="mt-3">
        <input className="input" name="name" defaultValue={m.name} required />
      </div>

      <div className="mt-3">
        <input className="input" name="priceDelta" type="number" defaultValue={m.priceDelta} required />
      </div>

      <button className="btn mt-4" type="submit">Guardar</button>
    </form>
  );
}
