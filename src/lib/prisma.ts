// src/app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

// Utilidad simple de validación
function isEmpty(value: unknown) {
  return value === undefined || value === null || String(value).trim() === '';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Asegura tipos consistentes
    const name = String(body?.name ?? '').trim();
    const description = String(body?.description ?? '');
    const stock = Number(body?.stock ?? 0);
    const active = Boolean(body?.active ?? true);

    // Si tu schema usa Decimal:
    const price = new Prisma.Decimal(body?.price);
    const cost = new Prisma.Decimal(body?.cost);

    // Si categoryId es Int en el schema, convierte:
    // const categoryId = Number(body?.categoryId);
    // Si es String (cuidar UUID/cuid):
    const categoryId = body?.categoryId;

    // Validación mínima
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
      }, // satisfies Prisma.ProductUncheckedCreateInput
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
