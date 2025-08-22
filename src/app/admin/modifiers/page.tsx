import Link from 'next/link';
import { adminFetchList } from '@/helpers/adminFetchList';
export const revalidate = 0;
export default async function ModifiersAdmin() {
  const modifiers = await adminFetchList('/api/modifiers');
  return (
    <main className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Modificadores</h1>
        <Link className="px-3 py-2 border rounded" href="/admin/modifiers/new">Nuevo</Link>
      </div>
      {!modifiers.length && <p className="opacity-70 text-sm">No hay modificadores.</p>}
      <ul className="space-y-2">{modifiers.map((m:any)=>(<li key={m.id} className="border p-3 rounded">{m.name} <span className="opacity-70 text-sm">(+${m.priceDelta ?? 0})</span></li>))}</ul>
    </main>
  );
}
