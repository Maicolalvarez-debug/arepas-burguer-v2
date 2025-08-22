// GET/POST orders
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { toInt, toNumber } from '@/lib/parsers';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const includeItems = url.searchParams.get('include') === 'items';
    const orders = await prisma.order.findMany({
      orderBy: { id: 'desc' },
      take: 100,
      include: includeItems ? { items: { include: { product: true, modifiers: { include: { modifier: true } } } } } : undefined
    });
    return NextResponse.json(Array.isArray(orders) ? orders : []);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    // Expect items: [{ productId, qty, price, cost, net, modifiers?: [{ modifierId, priceDelta, costDelta }] }]
    const tableCode = body?.tableCode ? String(body.tableCode) : null;
    const items = Array.isArray(body?.items) ? body.items : [];

    let gross = 0, discount = 0, net = 0, cost = 0;
    const itemsData = items.map((it: any) => {
      const qty = toInt(it?.qty ?? 1, 1);
      const price = toNumber(it?.price ?? 0, 0);
      const cst = toNumber(it?.cost ?? 0, 0);
      const n = toNumber(it?.net ?? qty * price, 0);
      gross += qty * price;
      cost  += qty * cst;
      net   += n;
      return {
        productId: toInt(it?.productId ?? 0, 0),
        qty, price, cost: cst, net: n,
        modifiers: {
          create: (Array.isArray(it?.modifiers) ? it.modifiers : []).map((m: any) => ({
            modifierId: toInt(m?.modifierId ?? 0, 0),
            priceDelta: toNumber(m?.priceDelta ?? 0, 0),
            costDelta:  toNumber(m?.costDelta  ?? 0, 0),
          }))
        }
      };
    });

    const created = await prisma.order.create({
      data: {
        tableCode, gross, discount, net, cost, profit: net - cost,
        items: { create: itemsData }
      },
      select: { id: true }
    });

    return NextResponse.json({ ok: true, id: created.id }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ ok:false, error: err?.message || 'Error creando orden' }, { status: 500 });
  }
}
