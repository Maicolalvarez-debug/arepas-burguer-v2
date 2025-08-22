
// app/api/products/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET() {
  const list = await prisma.product.findMany({ orderBy: [{ name: 'asc' }] });
  return NextResponse.json(list);
}

export async function POST(req: Request) {
      try {
        const body = await req.json();
        const name = (body?.name ?? '').toString().trim();
        if (!name) return NextResponse.json({ ok: false, error: 'Nombre requerido' }, { status: 400 });

        // Campos comunes en Product
        const price       = Number(body?.price ?? 0);
        const cost        = Number(body?.cost ?? 0);
        const stock       = Number(body?.stock ?? 0);
        const active      = Boolean(body?.active ?? true);
        const categoryId  = body?.categoryId != null ? Number(body.categoryId) : null;
        const description = (body?.description ?? '').toString();
        const image       = (body?.image ?? '').toString();

        const created = await prisma.product.create({
          data: {
            name, price, cost, stock, active,
            categoryId: Number.isFinite(categoryId) ? categoryId : null,
            description,
            image,
          } as any,
        });
        return NextResponse.json({ ok: true, id: created.id });
      } catch (err: any) {
        return NextResponse.json({ ok: false, error: err?.message || 'Error' }, { status: 500 });
      }
    }

