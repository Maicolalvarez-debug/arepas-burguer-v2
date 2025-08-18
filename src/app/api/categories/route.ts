// src/app/api/categories/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { categorySchema } from '@/schemas/category';
import { z } from 'zod';

export async function POST(req: Request){
  try {
    const data = categorySchema.parse(await req.json());
    const created = await prisma.category.create({ data: { name: data.name } });
    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Datos inválidos' }, { status: 400 });
  }
}

export async function PUT(req: Request){
  try {
    // En Zod no existe .required(); usa z.number() para hacer 'id' obligatorio
    const updateSchema = categorySchema.extend({ id: z.number() });
    const data = updateSchema.parse(await req.json());

    const updated = await prisma.category.update({
      where: { id: data.id },
      data: { name: data.name },
    });

    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Datos inválidos' }, { status: 400 });
  }
}

export async function DELETE(req: Request){
  const body = await req.json();
  const parsedId = z.number().safeParse(body?.id);
  if (!parsedId.success) {
    return NextResponse.json({ error: 'Falta id válido' }, { status: 400 });
  }
  await prisma.category.delete({ where: { id: parsedId.data } });
  return NextResponse.json({ ok: true });
}
