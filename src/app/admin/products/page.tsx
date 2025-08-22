import Link from 'next/link';
import { adminFetchList } from '@/helpers/adminFetchList';

export const revalidate = 0;

export default async function ProductsAdmin() {
  const products = await adminFetchList('/api/products');
  return (
    <main className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Productos</h1>
        <Link className="px-3 py-2 border rounded" href="/admin/products/new">Nuevo</Link>
      </div>
      {!products.length && <p className="opacity-70 text-sm">No hay productos.</p>}
      <div className="grid md:grid-cols-2 gap-4">
        {products.map((p: any) => (
          <div key={p.id} className="border p-3 rounded">
            <div className="font-medium">{p.name}</div>
            <div className="text-sm opacity-70">${p.price}</div>
            <div className="text-xs opacity-60">{p?.category?.name ?? 'Sin categoría'}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
