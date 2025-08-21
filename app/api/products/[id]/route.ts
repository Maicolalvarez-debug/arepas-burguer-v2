
// app/api/products/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

function parseId(param: string) {
  const id = Number(param);
  if (!Number.isFinite(id) || id <= 0) throw new Error('ID inválido');
  return id;
}

export async function GET(_: Request, ctx: { params: { id: string } }) {
  try {
    const id = parseId(ctx.params.id);
    const item = await prisma.product.findUnique({ where: { id } });
    if (!item) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    return NextResponse.json(item);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Error' }, { status: 400 });
  }
}

export async function PATCH(req: Request, ctx: { params: { id: string } }) {
      try {
        const id = parseId(ctx.params.id);
        const body = await req.json();
        const data: any = {};
        if (typeof body?.name !== 'undefined') data.name = (body.name ?? '').toString().trim();
        if (typeof body?.price !== 'undefined') data.price = Number(body.price);
        if (typeof body?.cost !== 'undefined')  data.cost  = Number(body.cost);
        if (typeof body?.stock !== 'undefined') data.stock = Number(body.stock);
        if (typeof body?.active !== 'undefined') data.active = Boolean(body.active);
        if (typeof body?.categoryId !== 'undefined') data.categoryId = body.categoryId == null ? null : Number(body.categoryId);
        if (typeof body?.description !== 'undefined') data.description = (body.description ?? '').toString();
        if (typeof body?.image !== 'undefined') data.image = (body.image ?? '').toString();

        if (data.name === '') return NextResponse.json({ ok: false, error: 'Nombre requerido' }, { status: 400 });
        if (Object.keys(data).length === 0) return NextResponse.json({ ok: false, error: 'Nada que actualizar' }, { status: 400 });

        await prisma.product.update({ where: { id }, data });
        return NextResponse.json({ ok: true });
      } catch (err: any) {
        return NextResponse.json({ ok: false, error: err?.message || 'Error' }, { status: 500 });
      }
    }


export async function DELETE(_: Request, ctx: { params: { id: string } }) {
  try {
    const id = parseId(ctx.params.id);
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Error' }, { status: 500 });
  }
}
