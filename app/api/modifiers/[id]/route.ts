
// app/api/modifiers/[id]/route.ts
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
    const item = await prisma.modifier.findUnique({ where: { id } });
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
    const name = (body?.name ?? '').toString().trim();
    if (!name) return NextResponse.json({ ok: false, error: 'Nombre requerido' }, { status: 400 });
    await prisma.modifier.update({ where: { id }, data: { name } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Error' }, { status: 500 });
  }
}

export async function DELETE(_: Request, ctx: { params: { id: string } }) {
  try {
    const id = parseId(ctx.params.id);
    await prisma.modifier.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Error' }, { status: 500 });
  }
}
