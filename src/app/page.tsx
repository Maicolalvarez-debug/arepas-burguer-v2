async function fetchJSON(path: string) {
  const res = await fetch(path, { cache: 'no-store' });
  if (!res.ok) return [];
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  }
  return [];
}

export default async function HomePage() {
  const [categories, products] = await Promise.all([
    fetchJSON('/api/categories'),
    fetchJSON('/api/products')
  ]);

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Menú</h1>
      {!categories.length && <p className="opacity-70 text-sm">No hay categorías.</p>}
      {categories.map((c: any) => (
        <section key={c.id} className="space-y-2">
          <h2 className="text-xl font-semibold">{c.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.filter((p: any) => p.categoryId === c.id).map((p: any) => (
              <div key={p.id} className="border p-3 rounded">
                <div className="font-medium">{p.name}</div>
                <div className="opacity-70">${p.price}</div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
