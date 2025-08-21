// src/app/api/modifiers/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validamos y tipamos la entrada con Zod para evitar 'unknown'
const modifierSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  // Si viene como string desde el front, coerce a number
  price: z.coerce.number().optional(),     // lo mapeamos a priceDelta
  costDelta: z.coerce.number().optional(),
  stock: z.coerce.number().optional(),
  active: z.coerce.boolean().optional(),
});

export async function GET() {
  const list = await prisma.modifier.findMany({ orderBy: { name: 'asc' } });
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  try {
    const input = modifierSchema.parse(await req.json());

    const created = await prisma.modifier.create({
      data: {
        name: input.name,
        priceDelta: input.price ?? 0,
        costDelta: input.costDelta ?? 0,
        stock: input.stock ?? 0,
        active: input.active ?? true,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? 'Datos inválidos' },
      { status: 400 }
    );
  }
}
