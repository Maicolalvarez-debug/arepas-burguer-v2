export const runtime = 'nodejs';
import { prisma } from "@/lib/prisma";
export async function GET(req: Request){
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from"); const to = searchParams.get("to");
  const where: any = {};
  if (from || to){ where.createdAt = {}; if (from) where.createdAt.gte = new Date(from + "T00:00:00"); if (to) where.createdAt.lte = new Date(to + "T23:59:59"); }
  const orders = await prisma.order.findMany({ where });
  const sales = orders.reduce((s,o)=>s+o.subtotal,0); const costs = orders.reduce((s,o)=>s+o.costTotal,0); const profit = sales - costs;
  const items = await prisma.orderItem.findMany({ where: { orderId: { in: orders.map(o=>o.id) } }, include: { product: true } });
  const map = new Map<number, { name:string, qty:number, revenue:number }>();
  for (const it of items){ const cur = map.get(it.productId) || { name: it.product.name, qty: 0, revenue: 0 }; cur.qty += it.quantity; cur.revenue += it.price * it.quantity; map.set(it.productId, cur); }
  const top = [...map.entries()].map(([productId, v])=>({ productId, ...v })).sort((a,b)=>b.qty-a.qty).slice(0,10);
  return Response.json({ sales, costs, profit, top });
}
