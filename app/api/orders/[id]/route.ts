
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const order = await prisma.order.findUnique({ where: { id }, include: { items: { include: { modifiers: true } } } });
  if (!order) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json(order);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const body = await req.json();
  const patch:any = {};
  if (typeof body.printed !== 'undefined') patch.printed = Boolean(body.printed);
  if (typeof body.discount !== 'undefined') {
    const current = await prisma.order.findUnique({ where: { id } });
    if (!current) return NextResponse.json({ error: 'not found' }, { status: 404 });
    const discount = Math.max(0, Number(body.discount||0));
    patch.discount = discount;
    patch.net = Math.max(0, current.gross - discount);
  }
  const order = await prisma.order.update({ where: { id }, data: patch });
  return NextResponse.json(order);
}
