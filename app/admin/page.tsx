import Link from "next/link";
import Card from "@/components/Card";
import { prisma } from "@/lib/prisma";
import { fmtCOP } from "@/components/Number";
import { startOfDay, endOfDay } from "date-fns";
export const dynamic = "force-dynamic"; export const runtime = 'nodejs';
export default async function AdminHome(){
  const today = new Date(); const from = startOfDay(today); const to = endOfDay(today);
  const orders = await prisma.order.findMany({ where: { createdAt: { gte: from, lte: to } } });
  const sales = orders.reduce((s,o)=>s+o.subtotal,0); const costs = orders.reduce((s,o)=>s+o.costTotal,0); const profit = sales - costs;
  return (<div className="space-y-4">
    <div className="grid md:grid-cols-3 gap-4">
      <Card><div className="text-sm text-gray-400">Ventas de hoy</div><div className="text-2xl font-semibold">{fmtCOP(sales)}</div></Card>
      <Card><div className="text-sm text-gray-400">Costos de hoy</div><div className="text-2xl font-semibold">{fmtCOP(costs)}</div></Card>
      <Card><div className="text-sm text-gray-400">Utilidad bruta</div><div className="text-2xl font-semibold">{fmtCOP(profit)}</div></Card>
    </div>
    <Card>
      <div className="flex flex-wrap gap-3">
        <Link className="btn" href="/admin/categories">Categorías</Link>
        <Link className="btn" href="/admin/products">Productos</Link>
        <Link className="btn" href="/admin/modifiers">Adicionales</Link>
        <Link className="btn" href="/admin/reports">Reportes</Link>
        <Link className="btn" href="/admin/qr">QR Mesas</Link>
        <Link className="btn" href="/admin/setup">Setup</Link>
        <form action="/api/logout" method="post" className="ml-auto"><button className="btn">Salir</button></form>
      </div>
    </Card>
  </div>);
}