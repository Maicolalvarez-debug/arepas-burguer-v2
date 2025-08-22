// app/api/modifiers/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Intentar ordenar por sortOrder si existe; si no, por name
    try {
      const rows = await prisma.modifier.findMany({ orderBy: { sortOrder: 'asc' } as any });
      if (rows && rows.length) return NextResponse.json(rows);
    } catch {}
    const rows = await prisma.modifier.findMany({ orderBy: { name: 'asc' } });
    return NextResponse.json(rows);
  } catch (err:any) {
    return NextResponse.json({ ok:false, error: err?.message || 'Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const name = String(body?.name || '').trim();
    if (!name) return NextResponse.json({ ok:false, error: 'Nombre requerido' }, { status: 400 });

    const priceDelta = Number(body?.priceDelta ?? body?.price ?? 0) || 0;
    const costDelta  = Number(body?.costDelta  ?? body?.cost  ?? 0) || 0;
    const stock      = Math.max(0, parseInt(String(body?.stock ?? 0), 10) || 0);
    const active     = typeof body?.active === 'boolean' ? body.active : String(body?.active).toLowerCase() === 'true';

    const created = await prisma.modifier.create({
      data: { name, priceDelta, costDelta, stock, active }
    });

    return NextResponse.json({ ok:true, id: created.id }, { status: 201 });
  } catch (err:any) {
    return NextResponse.json({ ok:false, error: err?.message || 'Error' }, { status: 500 });
  }
}
