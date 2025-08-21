// app/api/modifiers/reorder/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const idsInput = body?.ids;

    if (!Array.isArray(idsInput)) {
      return NextResponse.json({ ok: false, error: 'Body inválido. Se espera { ids: [...] }' }, { status: 400 });
    }

    const ids = idsInput.map((x: any) => (typeof x === 'string' ? Number(x) : x));
    if (ids.some((x: any) => typeof x !== 'number' || Number.isNaN(x))) {
      return NextResponse.json({ ok: false, error: 'IDs inválidos: se esperaban números o strings convertibles a número' }, { status: 400 });
    }

    await prisma.$transaction(
      ids.map((id: number, index: number) =>
        prisma.modifier.update({
          where: { id },
          data: ({ sortOrder: index } as any),
        })
      )
    );

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Error inesperado' }, { status: 500 });
  }
}
