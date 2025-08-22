// app/api/products/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidateTag } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    try {
      const list = await prisma.product.findMany({ orderBy: { sortOrder: 'asc' as any } as any });
      return NextResponse.json(list);
    } catch {
      const list = await prisma.product.findMany({ orderBy: { name: 'asc' } });
      return NextResponse.json(list);
    }
  } catch (err:any) {
    return NextResponse.json({ ok:false, error: err?.message || 'Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const image = (image ?? imageUrl ?? '')?.toString().trim() || null;.catch(() => ({} as any));
    const name = String(body?.name ?? '').trim();
    if (!name) return NextResponse.json({ ok:false, error:'Nombre requerido' }, { status: 400 });

    const toNumber = (v:any) => {
      if (v === '' || v === null || v === undefined) return 0;
      const n = Number(v);
      return Number.isFinite(n) ? n : 0;
    };
    const toInt = (v:any) => {
      const n = toNumber(v);
      return Math.trunc(n);
    };
    const toBool = (v:any) => {
      if (typeof v === 'boolean') return v;
      const s = String(v ?? '').toLowerCase();
      return s === 'true' || s === '1' || s === 'on';
    };
    const toIdOrNull = (v:any) => {
      if (v === '' || v === null || v === undefined) return null;
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    };

    const data:any = {
      name,
      description: body?.description ? String(body.description) : null,
      image: image ? String(body.image) : null,
      price: toNumber(body?.price),
      cost: toNumber(body?.cost),
      stock: toInt(body?.stock),
      active: toBool(body?.active),
      categoryId: toIdOrNull(body?.categoryId),
    };

    const created = await prisma.product.create({ data });
    try { revalidateTag('products'); } catch {}
    return NextResponse.json({ ok:true, id: created.id }, { status: 201 });
  } catch (err:any) {
    return NextResponse.json({ ok:false, error: err?.message || 'Error' }, { status: 500 });
  }
}
