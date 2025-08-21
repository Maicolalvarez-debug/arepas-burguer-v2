
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim();
  const categoryId = Number(searchParams.get('categoryId')) || undefined;

  const where:any = {};
  if (q) where.OR = [
    { name: { contains: q, mode: 'insensitive' } },
    { description: { contains: q, mode: 'insensitive' } }
  ];
  if (categoryId) where.categoryId = categoryId;

  const list = await prisma.product.findMany({
    where,
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
  });
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, description, price, cost, imageUrl, active = true, categoryId } = body;

  if (!name || !categoryId) {
    return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
  }

  const count = await prisma.product.count({ where: { categoryId: Number(categoryId) } });

  const created = await prisma.product.create({
    data: {
      name: String(name).trim(),
      description: description ? String(description) : null,
      price: Number(price || 0),
      cost: Number(cost || 0),
      imageUrl: imageUrl ? String(imageUrl) : null,
      active: Boolean(active),
      categoryId: Number(categoryId),
      sortOrder: count,
    },
  });

  return NextResponse.json(created, { status: 201 });
}
