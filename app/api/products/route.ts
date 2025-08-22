// app/api/products/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const toNumber = (v: any, d = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
};
const toInt = (v: any, d = 0) => {
  const n = parseInt(String(v ?? ''), 10);
  return Number.isFinite(n) ? n : d;
};
const toBool = (v: any) => {
  if (typeof v === 'boolean') return v;
  const s = String(v ?? '').toLowerCase();
  return s === 'true' || s === '1' || s === 'on' || s === 'yes';
};
const toIdOrNull = (v: any) => {
  const n = toInt(v, NaN);
  return Number.isFinite(n) ? n : null;
};

export async function GET() {
  try {
    let orderBy: any = { name: 'asc' };
    try {
      await prisma.$queryRaw`SELECT "sortOrder" FROM "Product" LIMIT 1`;
      orderBy = { sortOrder: 'asc' };
    } catch {}
    const items = await prisma.product.findMany({ orderBy, include: { category: true } });
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

    const description = String(body?.description ?? '').trim() || null;
    const rawImage = body?.image ?? body?.imageUrl ?? '';
    const image = String(rawImage ?? '').trim() || null;

    const price = toNumber(body?.price ?? 0, 0);
    const cost  = toNumber(body?.cost ?? 0, 0);
    const stock = toInt(body?.stock ?? 0, 0);
    const active = toBool(body?.active);
    const categoryId = toIdOrNull(body?.categoryId ?? null);

    const created = await prisma.product.create({
      data: { name, description, image, price, cost, stock, active, categoryId },
      select: { id: true },
    });

    return NextResponse.json({ ok:true, id: created.id }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ ok:false, error: err?.message || 'Error creando producto' }, { status: 500 });
  }
}
