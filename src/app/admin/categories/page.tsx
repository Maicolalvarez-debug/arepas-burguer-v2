import Link from 'next/link';
import { adminFetchList } from '@/helpers/adminFetchList';
export const revalidate = 0;
export default async function CategoriesAdmin() {
  const categories = await adminFetchList('/api/categories');
  return (
    <main className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Categorías</h1>
        <Link className="px-3 py-2 border rounded" href="/admin/categories/new">Nueva</Link>
      </div>
      {!categories.length && <p className="opacity-70 text-sm">No hay categorías.</p>}
      <ul className="space-y-2">{categories.map((c:any)=><li key={c.id} className="border p-3 rounded">{c.name}</li>)}</ul>
    </main>
  );
}
