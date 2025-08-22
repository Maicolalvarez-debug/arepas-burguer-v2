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

export async function POST(req: Request){
  try {
    const body = await req.json().catch(() => ({}));
    const name = (body?.name ?? '').toString().trim();
    if (!name) return NextResponse.json({ error: 'Nombre requerido' }, { status: 400 });
    const created = await prisma.category.create({ data: { name } });
    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Error' }, { status: 500 });
  }
}
