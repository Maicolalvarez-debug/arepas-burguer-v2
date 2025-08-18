// ./src/app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma'; // ajusta la ruta si tu cliente Prisma está en otro sitio

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Asegúrate que el front envía categoryId (requerido por tu schema)
    const data = {
      name: String(body.name ?? '').trim(),
      description: String(body.description ?? ''),
      // Si price/cost son Decimal en Prisma, usa Prisma.Decimal
      price: new Prisma.Decimal(body.price),
      cost: new Prisma.Decimal(body.cost),
      stock: Number(body.stock ?? 0),
      active: Boolean(body.active ?? true),
      // IMPORTANTE: debe existir en el body
      categoryId: body.categoryId, // string o number según tu schema
    } satisfies Prisma.ProductUncheckedCreateInput;

    // Validación mínima para no romper si falta la categoría
    if (data.categoryId === undefined || data.categoryId === null || data.name === '') {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios: categoryId y name.' },
        { status: 400 }
      );
    }

    const created = await prisma.product.create({
      data,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err?.message ?? 'Error interno' }, { status: 500 });
  }
}
