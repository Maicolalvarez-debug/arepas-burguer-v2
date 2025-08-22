export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidateTag } from 'next/cache';

function toNumber(v:any){ const n = Number(v); return Number.isFinite(n) ? n : 0; }
function toInt(v:any){ const n = parseInt(String(v||'').trim() || '0', 10); return Number.isFinite(n) ? n : 0; }
function toBool(v:any){ if (typeof v === 'boolean') return v; const s = String(v||'').toLowerCase(); return s==='true' || s==='on' || s==='1'; }
function toIdOrNull(v:any){ const s = String(v ?? '').trim(); if (!s) return null; const n = Number(s); return Number.isFinite(n) ? n : null; }

export async function GET() {
  try {
    let items:any[] = [];
    try {
      items = await prisma.product.findMany({ orderBy: { sortOrder: 'asc' } as any, include: { category: true } });
    } catch {
      items = await prisma.product.findMany({ orderBy: { name: 'asc' }, include: { category: true } });
    }
    return NextResponse.json(items);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const name = String(body?.name ?? '').trim();
    if (!name) return NextResponse.json({ ok:false, error:'Nombre requerido' }, { status: 400 });

    const description = (body?.description ?? '').toString().trim() || null;
    const rawImage = (body?.image ?? body?.imageUrl ?? '').toString().trim();
    const image = rawImage || null;
    const price = toNumber(body?.price);
    const cost = toNumber(body?.cost);
    const stock = toInt(body?.stock);
    const active = toBool(body?.active);
    const categoryId = toIdOrNull(body?.categoryId);

    const created = await prisma.product.create({
      data: { name, description, image, price, cost, stock, active, categoryId: categoryId as any }
    });
    try { revalidateTag('products'); } catch {}
    return NextResponse.json({ ok:true, id: created.id }, { status: 201 });
  } catch (err:any) {
    return NextResponse.json({ ok:false, error: err?.message || 'Error' }, { status: 500 });
  }
}
