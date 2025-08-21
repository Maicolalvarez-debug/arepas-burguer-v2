export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const list = await prisma.modifier.findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] });
    return NextResponse.json(list);
  } catch (err:any) {
    return NextResponse.json([], { status: 200 });
  }
}


export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const name = String(body?.name || '').trim();
    const priceDelta = Number(body?.priceDelta ?? 0);
    const costDelta = Number(body?.costDelta ?? 0);
    const stock = Number(body?.stock ?? 0);
    const active = Boolean(body?.active ?? true);
    if (!name) return NextResponse.json({ ok:false, error:'Nombre requerido' }, { status: 400 });
    // next sortOrder
    const last = await prisma.modifier.findFirst({ orderBy: { sortOrder: 'desc' } });
    const sortOrder = (last?.sortOrder ?? 0) + 1;
    const created = await prisma.modifier.create({ data: { name, priceDelta, costDelta, stock, active, sortOrder } });
    return NextResponse.json({ ok:true, id: created.id }, { status: 201 });
  } catch (err:any) {
    return NextResponse.json({ ok:false, error: err?.message || 'Error' }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    const body = await req.json().catch(()=> ({}));
    const name = String(body?.name || '').trim();
    const priceDelta = Number(body?.priceDelta ?? 0);
    const costDelta = Number(body?.costDelta ?? 0);
    const stock = Number(body?.stock ?? 0);
    const active = Boolean(body?.active ?? true);
    if (!name) return NextResponse.json({ ok:false, error:'Nombre requerido' }, { status: 400 });

    // sortOrder (si existe)
    let sortOrder: number | null = null;
    try {
      const last = await prisma.modifier.findFirst({ orderBy: { sortOrder: 'desc' }, select: { sortOrder: true } });
      sortOrder = ((last?.sortOrder as number|undefined) ?? 0) + 1;
    } catch { /* si la columna no existe, lo ignoramos */ }

    const data: any = { name, priceDelta, costDelta, stock, active };
    if (sortOrder !== null) data.sortOrder = sortOrder;

    const created = await prisma.modifier.create({ data });
    return NextResponse.json({ ok:true, id: created.id }, { status: 201 });
  } catch (err:any) {
    return NextResponse.json({ ok:false, error: err?.message || 'Error' }, { status: 500 });
  }
}
