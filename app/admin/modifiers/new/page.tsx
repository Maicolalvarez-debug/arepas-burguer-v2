
export default async function NewModifier(){
  return (
    <form id="form-with-autosave" className="card" action="/api/modifiers" method="post" encType="multipart/form-data">
      <h1>Nuevo adicional</h1>
      <div className="mt-3"><input className="input" name="name" placeholder="Nombre" required /></div>
      <div className="grid grid-3" style={{gap:12, marginTop:12}}>
        <input className="input" name="priceDelta" placeholder="Precio extra" />
        <input className="input" name="costDelta" placeholder="Costo extra" />
        <input className="input" name="stock" placeholder="Stock" />
      </div>
      <div className="section"><input type="file" name="image" accept="image/*" /></div>
      <div className="section"><button className="btn btn-primary" type="submit">Crear</button></div>
    </form>
  );
}
