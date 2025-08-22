export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function toNumber(v:any){ const n = Number(v); return Number.isFinite(n) ? n : 0; }
function toInt(v:any){ const n = parseInt(String(v||'').trim() || '0', 10); return Number.isFinite(n) ? n : 0; }
function toBool(v:any){ if (typeof v === 'boolean') return v; const s = String(v||'').toLowerCase(); return s==='true' || s==='on' || s==='1'; }

export async function GET() {
  try {
    let items:any[] = [];
    try {
      items = await prisma.modifier.findMany({ orderBy: { sortOrder: 'asc' } as any });
    } catch {
      items = await prisma.modifier.findMany({ orderBy: { name: 'asc' } });
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

    const priceDelta = toNumber(body?.priceDelta ?? body?.price);
    const costDelta = toNumber(body?.costDelta ?? body?.cost);
    const stock = toInt(body?.stock);
    const active = toBool(body?.active);

    const created = await prisma.modifier.create({
      data: { name, priceDelta, costDelta, stock, active } as any
    });
    return NextResponse.json({ ok:true, id: created.id }, { status: 201 });
  } catch (err:any) {
    return NextResponse.json({ ok:false, error: err?.message || 'Error' }, { status: 500 });
  }
}
