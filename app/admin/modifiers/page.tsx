import { prisma } from "@/lib/prisma";
import Card from "@/components/Card";
import Link from "next/link";
import { fmtCOP } from "@/components/Number";
export const dynamic = "force-dynamic";
export const runtime = 'nodejs';
export default async function ModsPage(){
  const mods = await prisma.modifier.findMany({ orderBy: { name: 'asc' } });
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center"><h1 className="text-2xl font-semibold">Adicionales</h1><Link className="btn" href="/admin/modifiers/new">Nuevo</Link></div>
      <Card>
        <table>
          <thead><tr><th>Nombre</th><th>ΔPrecio</th><th>ΔCosto</th><th>Stock</th><th>Activo</th><th></th></tr></thead>
          <tbody>{mods.map(m=>(<tr key={m.id}><td>{m.name}</td><td>{fmtCOP(m.priceDelta)}</td><td>{fmtCOP(m.costDelta)}</td><td>{m.stock}</td><td>{m.active? "Sí":"No"}</td><td><Link className="btn" href={`/admin/modifiers/${m.id}`}>Editar</Link></td></tr>))}</tbody>
        </table>
      </Card>
    </div>
  );
}
