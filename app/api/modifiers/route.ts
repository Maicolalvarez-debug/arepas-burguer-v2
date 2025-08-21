export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    try {
      const list = await prisma.modifier.findMany({ orderBy: ([{ sortOrder: 'asc' }, { name: 'asc' }] as any) });
      return NextResponse.json(list);
    } catch {
      const list = await prisma.modifier.findMany({ orderBy: [{ name: 'asc' }] });
      return NextResponse.json(list);
    }
  } catch (err:any) {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const name = (body?.name ?? '').toString().trim();
    if (!name) return NextResponse.json({ ok:false, error: 'Nombre requerido' }, { status: 400 });
    const priceDelta = Number(body?.priceDelta ?? 0) || 0;
    const costDelta = Number(body?.costDelta ?? 0) || 0;
    const stock = Number(body?.stock ?? 0) || 0;
    const active = typeof body?.active === 'boolean' ? body.active : true;

    // Nota: sortOrder está marcado como @ignore en el esquema Prisma, por lo que no existe en la BD.
    const created = await prisma.modifier.create({
      data: { name, priceDelta, costDelta, stock, active }
    });
    return NextResponse.json({ ok:true, id: created.id }, { status: 201 });
  } catch (err:any) {
    return NextResponse.json({ ok:false, error: err?.message || 'Error' }, { status: 500 });
  }
}
