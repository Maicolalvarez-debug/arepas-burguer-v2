export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { prisma } from '@/lib/prisma';

function isEmpty(value: unknown) {
  return value === undefined || value === null || String(value).trim() === '';
}

export async function GET() {
  try {
    try {
      const list = await prisma.product.findMany({
        orderBy: ([{ sortOrder: 'asc' }, { name: 'asc' }] as any),
        include: { category: true, modifiers: { include: { modifier: true } } }
      });
      return NextResponse.json(list);
    } catch {
      const list = await prisma.product.findMany({
        orderBy: [{ name: 'asc' }],
        include: { category: true, modifiers: { include: { modifier: true } } }
      });
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
    const description = (body?.description ?? '').toString();
    const price = Number(body?.price ?? 0);
    const cost  = Number(body?.cost ?? 0);
    const stock = Number(body?.stock ?? 0);
    const active = typeof body?.active === 'boolean' ? body.active : true;
    const categoryIdRaw = body?.categoryId;
    const categoryId = categoryIdRaw == null || categoryIdRaw === '' ? null : Number(categoryIdRaw);

    if (!name) return NextResponse.json({ error: 'Nombre requerido' }, { status: 400 });

    const created = await prisma.product.create({
      data: { name, description, price, cost, stock, active, categoryId }
    });
    try { revalidateTag('products'); } catch {}
    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Error' }, { status: 500 });
  }
}
