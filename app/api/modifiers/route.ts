export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function toNumber(v:any){ const n = Number(v); return Number.isFinite(n) ? n : 0; }
function toInt(v:any){ const n = parseInt(String(v||'').trim() || '0', 10); return Number.isFinite(n) ? n : 0; }
function toBool(v:any){ if (typeof v === 'boolean') return v; const s = String(v||'').toLowerCase(); return s==='true' || s==='on' || s==='1'; }

as any });
    } catch {
      items = await prisma.modifier.findMany({ orderBy: { name: 'asc' } });
    }
    return NextResponse.json(items);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

as any));
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


export async function GET(req: Request) {
  try {
    let items = [];
    try {
      items = await prisma.modifier.findMany({ orderBy: { sortOrder: 'asc' } });
    } catch {
      items = await prisma.modifier.findMany({ orderBy: { name: 'asc' } });
    }
    return NextResponse.json(Array.isArray(items) ? items : []);
  } catch (err:any) {
    return NextResponse.json([], { status: 200 });
  }
}


export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const name = (body?.name ?? '') ? (body?.name ?? '').toString().trim() : '';
    const priceDelta = Number(body?.priceDelta ?? 0) || 0;
    const costDelta = Number(body?.costDelta ?? 0) || 0;
    const stock = Math.trunc(Number(body?.stock ?? 0)) || 0;
    const active = (body?.active === true || String(body?.active).toLowerCase() === 'true' || String(body?.active).toLowerCase() === 'on');
    if (typeof name !== 'undefined') {
      if (!name || String(name).trim() === '') {
        return NextResponse.json({ ok:false, error:'Nombre requerido' }, { status: 400 });
      }
    }
    const created = await prisma.modifier.create({ data: { name, priceDelta, costDelta, stock, active } });
    return NextResponse.json({ ok:true, id: created.id }, { status: 201 });
  } catch (err:any) {
    return NextResponse.json({ ok:false, error: err?.message || 'Error' }, { status: 500 });
  }
}
