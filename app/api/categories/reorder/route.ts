// app/api/categories/reorder/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { ids } = await req.json();
    if (!Array.isArray(ids) || ids.some((x) => typeof x !== 'string')) {
      return NextResponse.json({ ok: false, error: 'Body inválido. Se espera { ids: string[] }' }, { status: 400 });
    }

    // Si tu modelo Category NO tiene el campo `position` aún,
    // este cast a `any` evita errores de Typescript durante el build.
    await prisma.$transaction(
      ids.map((id: string, index: number) =>
        prisma.category.update({
          where: { id },
          data: ({ position: index } as any),
        })
      )
    );

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Error inesperado' }, { status: 500 });
  }
}
