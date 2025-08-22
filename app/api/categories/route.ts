export const dynamic = 'force-dynamic'

// app/api/categories/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET() {
  const list = await prisma.category.findMany({ orderBy: [{ name: 'asc' }] });
  return NextResponse.json(list, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = (body?.name ?? '').toString().trim();
    if (!name) return NextResponse.json({ ok: false, error: 'Nombre requerido' }, { status: 400 }, { headers: { 'Cache-Control': 'no-store' } });
    const created = await prisma.category.create({ data: { name } });
    return NextResponse.json({ ok: true, id: created.id }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Error' }, { status: 500 }, { headers: { 'Cache-Control': 'no-store' } });
  }
}
