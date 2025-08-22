// app/api/categories/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Intentar ordenar por sortOrder si existe; fallback por name
    try {
      const cats = await prisma.category.findMany({ orderBy: { sortOrder: 'asc' } as any });
      return NextResponse.json({ ok: true, items: cats }, { status: 200 });
    } catch {
      const cats = await prisma.category.findMany({ orderBy: { name: 'asc' } });
      return NextResponse.json({ ok: true, items: cats }, { status: 200 });
    }
  } catch (err:any) {
    return NextResponse.json({ ok:false, error: err?.message || 'Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const name = String(body?.name ?? '').trim();
    if (!name) return NextResponse.json({ ok:false, error:'Nombre requerido' }, { status: 400 });

    const active = typeof body?.active === 'boolean'
      ? body.active
      : String(body?.active ?? '').toLowerCase() === 'true' || String(body?.active ?? '').toLowerCase() === 'on';

    const imgInput = String((body?.image ?? body?.imageUrl ?? '') || '').trim();
    const image = imgInput ? imgInput : null;

    const description = (body?.description ?? '') ? String(body.description).trim() : null;

    const created = await prisma.category.create({
      data: { name, image, description, active },
      select: { id: true }
    });

    return NextResponse.json({ ok:true, id: created.id }, { status: 201 });
  } catch (err:any) {
    return NextResponse.json({ ok:false, error: err?.message || 'Error creando categoría' }, { status: 500 });
  }
}
