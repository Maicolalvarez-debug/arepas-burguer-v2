// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function isEmpty(value: unknown) {
  return value === undefined || value === null || String(value).trim() === '';
}

export async function GET() {
  const list = await prisma.product.findMany({
    orderBy: { name: 'asc' },
  });
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const name = String(body?.name ?? '').trim();
    const description = String(body?.description ?? '');
    const stock = Number(body?.stock ?? 0);
    const active = body?.active === undefined ? true : Boolean(body?.active);

    // En tu schema price y cost son number -> usar Number(...)
    const price = Number(body?.price);
    const cost = Number(body?.cost);

    // Ajusta tipo según tu schema (Number(...) si es Int)
    const categoryId = Number(body?.categoryId ?? NaN);

    if (isEmpty(name) || Number.isNaN(categoryId)) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios válidos: name y categoryId.' },
        { status: 400 }
      );
    }

    const created = await prisma.product.create({
      data: {
        name,
        description,
        price,
        cost,
        stock,
        active,
        categoryId,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err?.message ?? 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
