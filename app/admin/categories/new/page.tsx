
export default function NewCategory(){
  return (
    <form className="card" action="/api/categories" method="post">
      <h1>Nueva categoría</h1>
      <div className="grid" style={{gap:12}}><input className="input" name="name" placeholder="Nombre de categoría" required /></div>
      <div className="section"><button className="btn btn-primary" type="submit">Crear</button></div>
    </form>
  );
}
