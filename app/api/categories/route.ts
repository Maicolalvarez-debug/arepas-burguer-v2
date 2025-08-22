// app/api/categories/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    try {
      const list = await prisma.category.findMany({ orderBy: { sortOrder: 'asc' as any } as any });
      return NextResponse.json(list);
    } catch {
      const list = await prisma.category.findMany({ orderBy: { name: 'asc' } });
      return NextResponse.json(list);
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

    const data:any = {
      name,
      description: body?.description ? String(body.description) : null,
      imageUrl: body?.imageUrl ? String(body.imageUrl) : null,
      active: typeof body?.active === 'boolean' ? body.active : String(body?.active ?? '') === 'true'
    };

    const created = await prisma.category.create({ data });
    return NextResponse.json({ ok:true, id: created.id }, { status: 201 });
  } catch (err:any) {
    return NextResponse.json({ ok:false, error: err?.message || 'Error' }, { status: 500 });
  }
}
