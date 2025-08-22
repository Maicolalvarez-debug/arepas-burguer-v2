import Link from 'next/link';
export default function AdminIndex() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Admin</h1>
      <ul className="list-disc pl-6">
        <li><Link href="/admin/categories">Categorías</Link></li>
        <li><Link href="/admin/products">Productos</Link></li>
        <li><Link href="/admin/modifiers">Modificadores</Link></li>
        <li><Link href="/admin/orders">Órdenes</Link></li>
      </ul>
    </main>
  );
}
