import { prisma } from "@/lib/prisma";
import Card from "@/components/Card";
import { fmtCOP } from "@/components/Number";
import Link from "next/link";
export const dynamic = "force-dynamic";
export const runtime = 'nodejs';
export default async function ProductsPage(){
  const products = await prisma.product.findMany({ include: { category: true }, orderBy: { name: 'asc' } });
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center"><h1 className="text-2xl font-semibold">Productos</h1><Link className="btn" href="/admin/products/new">Nuevo</Link></div>
      <Card>
        <table><thead><tr><th>Nombre</th><th>Precio</th><th>Costo</th><th>Stock</th><th>Activo</th><th></th></tr></thead>
          <tbody>{products.map(p=>(<tr key={p.id}><td>{p.name}</td><td>{fmtCOP(p.price)}</td><td>{fmtCOP(p.cost)}</td><td>{p.stock}</td><td>{p.active? "Sí":"No"}</td><td><Link className="btn" href={`/admin/products/${p.id}`}>Editar</Link></td></tr>))}</tbody>
        </table>
      </Card>
    </div>
  );
}
