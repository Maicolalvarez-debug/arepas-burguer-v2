import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const printed = searchParams.get('printed');
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const where:any = {};
  if (printed && printed !== 'all') where.printed = printed === 'true';
  if (from || to) where.createdAt = {};
  if (from) (where.createdAt as any).gte = new Date(from as string + 'T00:00:00.000');
  if (to)   (where.createdAt as any).lte = new Date(to as string   + 'T23:59:59.999');
  const orders = await prisma.order.findMany({ where, orderBy: { createdAt: 'desc' } });
  return NextResponse.json(orders);
}

type BodyItem = { productId: number; quantity: number; modifiers?: { modifierId: number; quantity?: number }[] }

export async function POST(req: NextRequest) {
  const b = await req.json();
  const tableCode = b.tableCode || null;
  const discount = Number(b.discount || 0);
  const items: BodyItem[] = Array.isArray(b.items) ? b.items : [];
  if (!items.length) return NextResponse.json({ error: 'items required' }, { status: 400 });

  // Collect product and modifier ids
  const productIds = Array.from(new Set(items.map(i => Number(i.productId)).filter(Boolean)));
  const modifierIds = Array.from(new Set(items.flatMap(i => (i.modifiers||[]).map(m=>Number(m.modifierId))).filter(Boolean)));

  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  const productMap = new Map(products.map(p => [p.id, p]));
  const modifiers = modifierIds.length ? await prisma.modifier.findMany({ where: { id: { in: modifierIds } } }) : [];
  const modifierMap = new Map(modifiers.map(m => [m.id, m]));

  let gross = 0, totalCost = 0;
  const orderItemsData: any[] = [];

  for (const it of items) {
    const qty = Math.max(1, Number(it.quantity || 1));
    const prod = productMap.get(Number(it.productId));
    if (!prod) continue;

    const unitPrice = Number((prod as any).price || 0);
    const unitCost  = Number((prod as any).cost  || 0);
    const name      = (prod as any).name as string;

    let modsPrice = 0, modsCost = 0;
    const itemModsData:any[] = [];
    for (const m of (it.modifiers||[])) {
      const mq = Math.max(1, Number(m.quantity || 1));
      const md = modifierMap.get(Number(m.modifierId));
      if (!md) continue;
      const priceDelta = Number((md as any).price || 0);
      const costDelta  = Number((md as any).cost  || 0);
      const modifierName = (md as any).name as string;
      modsPrice += priceDelta * mq; modsCost += costDelta * mq;
      itemModsData.push({ modifierId: md.id, modifierName, quantity: mq, priceDelta, costDelta });
    }

    const subtotal = unitPrice * qty + modsPrice * qty;
    const subtotalCost = unitCost * qty + modsCost * qty;
    gross += subtotal; totalCost += subtotalCost;

    orderItemsData.push({
      productId: prod.id,
      productName: name,
      quantity: qty,
      unitPrice, unitCost,
      subtotal, subtotalCost,
      modifiers: { create: itemModsData }
    });
  }

  const net = Math.max(0, gross - discount);
  const order = await prisma.order.create({
    data: { tableCode, discount, gross, net, cost: totalCost, printed: false, items: { create: orderItemsData } }
  });
  return NextResponse.json({ ok: true, id: order.id }, { status: 201 });
}
