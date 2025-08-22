export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


= new URL(req.url);
  const printed = searchParams.get('printed');
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const status = searchParams.get('status'); // pending|preparing|ready|cancelled
  const includeItems = searchParams.get('include') === 'items';
  const where:any = {};
  if (printed !== null) where.printed = printed === 'true';
  if (status) where.status = status;
  if (from || to) where.createdAt = {};
  if (from) (where.createdAt as any).gte = new Date(from as string);
  if (to) (where.createdAt as any).lte = new Date(to as string + 'T23:59:59.999Z');

  const orders = await prisma.order.findMany({
    where,
    orderBy: { id: 'desc' },
    take: 100,
    include: includeItems ? { items: { include: { modifiers: true } } } : undefined
  });

  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const tableCode = body.tableCode || null;
  const discount = Number(body.discount || 0);
  const items = Array.isArray(body.items) ? body.items : [];
  if (!items.length) return NextResponse.json({ error: 'items vacíos' }, { status: 400 });

  let gross = 0, totalCost = 0;
  const orderItemsData:any[] = [];

  for (const it of items) {
    const qty = Math.max(1, Number(it.qty || it.quantity || 1));
    let name = it.name as string | undefined;
    let unitPrice = Number(it.price ?? it.basePrice ?? 0);
    let unitCost = Number(it.cost ?? 0);
    let productId: number | undefined = it.productId ? Number(it.productId) : (it.id ? Number(it.id) : undefined);
    if (productId && (!name || !unitPrice)) {
      const p = await prisma.product.findUnique({ where: { id: productId } });
      if (p) { name = name || p.name; unitPrice = unitPrice || p.price; unitCost = unitCost || p.cost; }
    }
    if (!name) name = 'Producto';
    const mods = Array.isArray(it.modifiers) ? it.modifiers : [];
    let modsPrice = 0, modsCost = 0;
    const itemModsData:any[] = [];
    for (const m of mods) {
      const mq = Math.max(1, Number(m.qty || m.quantity || 1));
      let mName = m.name as string | undefined;
      let priceDelta = Number(m.priceDelta ?? 0);
      let costDelta = Number(m.costDelta ?? 0);
      const modifierId = m.modifierId ? Number(m.modifierId) : (m.id ? Number(m.id) : undefined);
      if (modifierId && (!mName || (!priceDelta && !costDelta))) {
        const dbm = await prisma.modifier.findUnique({ where: { id: modifierId } });
        if (dbm) { mName = mName || dbm.name; if (!priceDelta) priceDelta = dbm.priceDelta; if (!costDelta) costDelta = dbm.costDelta; }
      }
      if (!mName) mName = 'Modificador';
      modsPrice += priceDelta * mq; modsCost  += costDelta * mq;
      itemModsData.push({ modifierId, modifierName: mName, quantity: mq, priceDelta, costDelta });
    }
    const subtotal = unitPrice * qty + modsPrice * qty;
    const subtotalCost = unitCost * qty + modsCost * qty;
    gross += subtotal; totalCost += subtotalCost;
    orderItemsData.push({ productId, productName: name, quantity: qty, unitPrice, unitCost, subtotal, subtotalCost, modifiers: { create: itemModsData } });
  }
  const net = Math.max(0, gross - discount);
  const order = await prisma.order.create({ data: { tableCode, gross, discount, net, cost: totalCost, items: { create: orderItemsData } } });
  return NextResponse.json({ ok: true, id: order.id }, { status: 201 });
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const includeItems = String(url.searchParams.get('include')||'') === 'items';
    const orders = await prisma.order.findMany({
      orderBy: { id: 'desc' },
      include: includeItems ? { items: true } : undefined,
      take: 100
    });
    return NextResponse.json(Array.isArray(orders) ? orders : []);
  } catch (err:any) {
    return NextResponse.json([], { status: 200 });
  }
}
