import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { toNumber, toInt, toBool } from '@/lib/parsers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let orderBy: any = { name: 'asc' };
    try { await prisma.$queryRaw`SELECT "sortOrder" FROM "Modifier" LIMIT 1`; orderBy = { sortOrder: 'asc' }; } catch {}
    const items = await prisma.modifier.findMany({ orderBy });
    return NextResponse.json(Array.isArray(items) ? items : []);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const name = String(body?.name ?? '').trim();
    if (!name) return NextResponse.json({ ok:false, error:'Nombre requerido' }, { status: 400 });

    const priceDelta = toNumber(body?.priceDelta ?? body?.price ?? 0, 0);
    const costDelta  = toNumber(body?.costDelta  ?? body?.cost  ?? 0, 0);
    const stock = toInt(body?.stock ?? 0, 0);
    const active = toBool(body?.active);

    const created = await prisma.modifier.create({
      data: { name, priceDelta, costDelta, stock, active },
      select: { id: true },
    });

    return NextResponse.json({ ok:true, id: created.id }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ ok:false, error: err?.message || 'Error creando modificador' }, { status: 500 });
  }
}
