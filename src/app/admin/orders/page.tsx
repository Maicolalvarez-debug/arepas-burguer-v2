import { adminFetchList } from '@/helpers/adminFetchList';

export const revalidate = 0;

export default async function OrdersAdmin() {
  const orders = await adminFetchList('/api/orders?include=items');
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Órdenes</h1>
      {!orders.length && <p className="opacity-70 text-sm">No hay órdenes.</p>}
      <div className="space-y-3">
        {orders.map((o: any) => (
          <div key={o.id} className="border p-3 rounded">
            <div className="font-medium">Orden #{o.id}</div>
            <div className="text-sm opacity-70">Items: {o?.items?.length ?? 0}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
