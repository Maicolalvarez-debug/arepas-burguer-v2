
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { prisma } from '@/lib/prisma';

function toNum(v:any, def:number=0){ const n = Number(v); return Number.isFinite(n) ? n : def; }


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
    if (!name) return NextResponse.json({ ok:false, error:'Nombre requerido' }, { status:400 });

    const description = (body?.description ?? '').toString().trim() || null;
    const image = (body?.image ?? body?.imageUrl ?? '').toString().trim() || null;

    const price = toNum(body?.price, 0);
    const cost = toNum(body?.cost, 0);
    const stock = Math.trunc(toNum(body?.stock, 0));
    const active = typeof body?.active === 'boolean' ? body.active
                  : (String(body?.active ?? '').toLowerCase() === 'true');
    const categoryId = (body?.categoryId === null || body?.categoryId === '' || typeof body?.categoryId === 'undefined')
                       ? null
                       : Number(body?.categoryId);

    const created = await prisma.product.create({
      data: { name, description, image, price, cost, stock, active, categoryId }
    });

    try { const { revalidateTag } = await import('next/cache'); revalidateTag('products'); } catch {}

    return NextResponse.json({ ok:true, id: created.id }, { status: 201 });
  } catch (err:any) {
    return NextResponse.json({ ok:false, error: err?.message || 'Error' }, { status: 500 });
  }
}
