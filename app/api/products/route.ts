// src/app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
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
    const active = Boolean(body?.active ?? true);

    // Cambia a Number(...) si price/cost no son Decimal en tu schema
    const price = new Prisma.Decimal(body?.price);
    const cost = new Prisma.Decimal(body?.cost);

    // Ajusta tipo según tu schema (Number(...) si es Int)
    const categoryId = body?.categoryId;

    if (isEmpty(name) || isEmpty(categoryId)) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios: name y categoryId.' },
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
