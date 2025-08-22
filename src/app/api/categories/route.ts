// GET/POST categories
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { toBool } from '@/lib/parsers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let orderBy: any = { name: 'asc' };
    try { await prisma.$queryRaw`SELECT "sortOrder" FROM "Category" LIMIT 1`; orderBy = { sortOrder: 'asc' }; } catch {}
    const items = await prisma.category.findMany({ orderBy });
    return NextResponse.json(Array.isArray(items) ? items : []);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const name = String(body?.name ?? '').trim();
    if (!name) return NextResponse.json({ ok:false, error:'Nombre requerido' }, { status: 400 });

    const description = String(body?.description ?? '').trim() || null;
    const rawImage = body?.image ?? body?.imageUrl ?? '';
    const image = String(rawImage ?? '').trim() || null;
    const active = toBool(body?.active);

    const created = await prisma.category.create({
      data: { name, description, image, active },
      select: { id: true },
    });

    return NextResponse.json({ ok:true, id: created.id }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ ok:false, error: err?.message || 'Error creando categoría' }, { status: 500 });
  }
}
