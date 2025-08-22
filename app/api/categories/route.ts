
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    try {
      const list = await prisma.category.findMany({ orderBy: ([{ sortOrder: 'asc' }, { name: 'asc' }] as any) });
      return NextResponse.json(list);
    } catch {
      const list = await prisma.category.findMany({ orderBy: [{ name: 'asc' }] });
      return NextResponse.json(list);
    }
  } catch (err:any) {
    return NextResponse.json([], { status: 200 });
  }
}


export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const name = (body?.name ?? '').toString().trim();
    if (!name) return NextResponse.json({ ok:false, error:'Nombre requerido' }, { status:400 });
    const description = (body?.description ?? '').toString().trim() || null;
    const image = (body?.image ?? body?.imageUrl ?? '').toString().trim() || null;
    const active = typeof body?.active === 'boolean' ? body.active
                  : (String(body?.active ?? '').toLowerCase() === 'true');
    const created = await prisma.category.create({
      data: { name, description, image, active }
    });
    return NextResponse.json({ ok:true, id: created.id }, { status: 201 });
  } catch (err:any) {
    return NextResponse.json({ ok:false, error: err?.message || 'Error' }, { status: 500 });
  }
}
