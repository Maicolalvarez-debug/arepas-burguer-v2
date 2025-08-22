export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidateTag } from 'next/cache';

as any });
    } catch {
      items = await prisma.category.findMany({ orderBy: { name: 'asc' } });
    }
    return NextResponse.json(items);
  } catch (err:any) {
    return NextResponse.json([], { status: 200 });
  }
}

as any));
    const name = String(body?.name ?? '').trim();
    if (!name) return NextResponse.json({ ok:false, error:'Nombre requerido' }, { status: 400 });

    const description = (body?.description ?? '').toString().trim() || null;
    const rawImage = (body?.image ?? body?.imageUrl ?? '').toString().trim();
    const image = rawImage || null;
    const active = (String(body?.active).toLowerCase() === 'true') || body?.active === true;

    const created = await prisma.category.create({ data: { name, description, image, active } });
    try { revalidateTag('categories'); } catch {}
    return NextResponse.json({ ok:true, id: created.id }, { status: 201 });
  } catch (err:any) {
    return NextResponse.json({ ok:false, error: err?.message || 'Error' }, { status: 500 });
  }
}


export async function GET(req: Request) {
  try {
    let items = [];
    try {
      items = await prisma.category.findMany({ orderBy: { sortOrder: 'asc' } });
    } catch {
      items = await prisma.category.findMany({ orderBy: { name: 'asc' } });
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
    const description = (body?.description ?? '') ? (body?.description ?? '').toString().trim() : null;
    const image = (body?.image ?? body?.imageUrl) ? (body?.image ?? body?.imageUrl).toString().trim() : null;
    const active = (body?.active === true || String(body?.active).toLowerCase() === 'true' || String(body?.active).toLowerCase() === 'on');
    if (typeof name !== 'undefined') {
      if (!name || String(name).trim() === '') {
        return NextResponse.json({ ok:false, error:'Nombre requerido' }, { status: 400 });
      }
    }
    const created = await prisma.category.create({ data: { name, description, image, active } });
    try { revalidateTag('categories'); } catch {}
return NextResponse.json({ ok:true, id: created.id }, { status: 201 });
  } catch (err:any) {
    return NextResponse.json({ ok:false, error: err?.message || 'Error' }, { status: 500 });
  }
}
