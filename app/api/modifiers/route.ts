
// app/api/modifiers/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET() {
  const list = await prisma.modifier.findMany({ orderBy: [{ name: 'asc' }] });
  return NextResponse.json(list);
}

export async function POST(req: Request) {
      try {
        const body = await req.json();
        const name = (body?.name ?? '').toString().trim();
        if (!name) return NextResponse.json({ ok: false, error: 'Nombre requerido' }, { status: 400 });

        // Campos requeridos por el schema (defaults seguros)
        const priceDelta = Number(body?.priceDelta ?? 0);
        const costDelta  = Number(body?.costDelta  ?? 0);
        const stock      = Number(body?.stock      ?? 0);
        const active     = Boolean(body?.active ?? true);

        const created = await prisma.modifier.create({
          data: {
            name,
            priceDelta,
            costDelta,
            stock,
            active,
          } as any, // en caso de diferencias menores de tipos, forzamos compatibilidad
        });
        return NextResponse.json({ ok: true, id: created.id });
      } catch (err: any) {
        return NextResponse.json({ ok: false, error: err?.message || 'Error' }, { status: 500 });
      }
    }

