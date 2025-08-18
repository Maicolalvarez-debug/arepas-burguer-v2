export default function MenuPage() {
  const items = [
    { name: "Hawaiana", price: 18000 },
    { name: "Costeña", price: 20000 },
    { name: "Clásica", price: 15000 },
  ];
  return (
    <main className="container">
      <h2 className="text-2xl font-semibold mt-6">Nuestro Menú</h2>
      <div className="grid gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <div key={it.name} className="rounded-xl bg-neutral-900/80 border border-red-700 p-4 shadow-lg">
            <h3 className="text-lg font-bold">{it.name}</h3>
            <p className="text-neutral-300">${it.price.toLocaleString()}</p>
            <button className="btn-primary mt-3">Añadir</button>
          </div>
        ))}
      </div>
    </main>
  );
}
