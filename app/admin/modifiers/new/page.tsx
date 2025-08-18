
export default async function NewModifier() {
  return (
    <form
      id="form-with-autosave"
      className="card"
      action="/api/modifiers"
      method="post"
      encType="multipart/form-data"
    >
      <h1>Nuevo adicional</h1>

      <div className="mt-3">
        <input className="input" name="name" placeholder="Nombre" required />
      </div>

      <div className="mt-3">
        <input className="input" name="priceDelta" placeholder="Precio extra (número)" type="number" required />
      </div>

      <button className="btn mt-4" type="submit">Crear</button>
    </form>
  );
}
