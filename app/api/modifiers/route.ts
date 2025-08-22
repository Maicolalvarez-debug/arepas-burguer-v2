// app/api/modifiers/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    try {
      const list = await prisma.modifier.findMany({ orderBy: { sortOrder: 'asc' as any } as any });
      return NextResponse.json(list);
    } catch {
      const list = await prisma.modifier.findMany({ orderBy: { name: 'asc' } });
      return NextResponse.json(list);
    }
  } catch (err:any) {
    return NextResponse.json({ ok:false, error: err?.message || 'Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const name = String(body?.name ?? '').trim();
    if (!name) return NextResponse.json({ ok:false, error:'Nombre requerido' }, { status: 400 });

    const toNumber = (v:any) => {
      if (v === '' || v === null || v === undefined) return 0;
      const n = Number(v);
      return Number.isFinite(n) ? n : 0;
    };
    const toInt = (v:any) => Math.trunc(toNumber(v));
    const toBool = (v:any) => {
      if (typeof v === 'boolean') return v;
      const s = String(v ?? '').toLowerCase();
      return s === 'true' || s === '1' || s === 'on';
    };

    const data:any = {
      name,
      priceDelta: toNumber(body?.priceDelta ?? body?.price),
      costDelta: toNumber(body?.costDelta ?? body?.cost),
      stock: toInt(body?.stock),
      active: toBool(body?.active),
    };

    const created = await prisma.modifier.create({ data });
    return NextResponse.json({ ok:true, id: created.id }, { status: 201 });
  } catch (err:any) {
    return NextResponse.json({ ok:false, error: err?.message || 'Error' }, { status: 500 });
  }
}
