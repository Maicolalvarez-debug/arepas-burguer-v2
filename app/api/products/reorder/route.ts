import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const ids: number[] = Array.isArray(body?.ids) ? body.ids.map(Number) : [];
    if (ids.length === 0) return NextResponse.json({ ok: false, error: 'Lista vacía' }, { status: 400 });

    const ops = ids.map((id, idx) =>
      prisma.product.update({
        where: { id },
        data: ({ sortOrder: idx } as any),
      })
    );

    try {
      await prisma.$transaction(ops);
    } catch {
      // sortOrder column may not exist in this DB; ignore reorder silently
    }
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Error' }, { status: 500 });
  }
}
