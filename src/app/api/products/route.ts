import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { productSchema } from '@/schemas/product';

// POST /api/products
export async function POST(req: Request) {
  try {
    const data = productSchema.parse(await req.json());

    const created = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description ?? '',
        price: data.price,
        cost: data.cost,
        stock: data.stock,
        active: data.active ?? true,
        ...(data.categoryId
          ? { category: { connect: { id: data.categoryId } } }
          : {}),
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

// PUT /api/products
export async function PUT(req: Request) {
  try {
    const data = productSchema.parse(await req.json());
    if (!data.id) throw new Error('Falta id');

    const updated = await prisma.product.update({
      where: { id: data.id },
      data: {
        name: data.name,
        description: data.description ?? '',
        price: data.price,
        cost: data.cost,
        stock: data.stock,
        ...(typeof data.active === 'boolean' ? { active: data.active } : {}),
        ...(data.categoryId === null
          ? { category: { disconnect: true } }
          : data.categoryId
          ? { category: { connect: { id: data.categoryId } } }
          : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

// DELETE /api/products
export async function DELETE(req: Request) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Falta id' }, { status: 400 });

  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
