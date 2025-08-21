
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const ids: number[] = Array.isArray(body?.ids) ? body.ids.map(Number) : [];
    if (ids.length === 0) return NextResponse.json({ ok: false, error: 'Lista vacía' }, { status: 400 });
    const ops = ids.map((id, idx) => prisma.modifier.update({ where: { id }, data: { sortOrder: idx } }));
    await prisma.$transaction(ops);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Error' }, { status: 500 });
  }
}
