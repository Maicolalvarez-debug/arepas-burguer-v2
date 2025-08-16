export const runtime = 'nodejs';
import { prisma } from "@/lib/prisma";
export async function POST(req: Request){
  const body = await req.json();
  const mesa: string | null = body.mesa || null;
  const items: { productId:number; quantity:number; modifiers:{id:number; name:string; priceDelta:number; costDelta:number}[] }[] = body.items || [];
  if (!Array.isArray(items) || items.length===0) return new Response(JSON.stringify({ error: "Sin items" }), { status: 400 });
  const productIds = Array.from(new Set(items.map(i=>i.productId)));
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  const modIds = Array.from(new Set(items.flatMap(i=>i.modifiers?.map(m=>m.id)||[])));
  const modifiers = await prisma.modifier.findMany({ where: { id: { in: modIds } } });
  const modMap = new Map(modifiers.map(m=>[m.id, m]));
  let subtotal = 0; let costTotal = 0;
  const orderItems = items.map(i=>{
    const p = products.find(pp=>pp.id===i.productId); if (!p) throw new Error("Producto no encontrado");
    const mods = (i.modifiers||[]).map(m=>{ const ref = modMap.get(m.id); return { id: m.id, name: ref?.name || m.name, priceDelta: ref?.priceDelta ?? m.priceDelta ?? 0, costDelta: ref?.costDelta ?? m.costDelta ?? 0 }; });
    const modsPrice = mods.reduce((s,m)=>s+m.priceDelta,0); const modsCost = mods.reduce((s,m)=>s+m.costDelta,0);
    const unitPrice = p.price + modsPrice; const unitCost = p.cost + modsCost;
    subtotal += unitPrice * i.quantity; costTotal += unitCost * i.quantity;
    return { productId: p.id, quantity: i.quantity, price: unitPrice, cost: unitCost, modifiers: mods };
  });
  const order = await prisma.order.create({ data: { table: mesa || undefined, subtotal, total: subtotal, costTotal, status: "sent", items: { create: orderItems } }, include: { items: true } });
  for (const it of items){
    await prisma.product.update({ where: { id: it.productId }, data: { stock: { decrement: it.quantity } } });
    for (const m of it.modifiers || []){
      await prisma.modifier.update({ where: { id: m.id }, data: { stock: { decrement: it.quantity } } });
    }
  }
  return Response.json({ ok: true, orderId: order.id });
}
