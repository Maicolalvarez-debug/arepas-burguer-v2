// app/api/modifiers/route.ts
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const list = await prisma.modifier.findMany({ orderBy: { name: 'asc' } });
  return Response.json(list);
}

export async function POST(req: Request) {
  const { name, priceDelta, costDelta, stock, active } = await req.json();

  if (!name || String(name).trim() === '') {
    return Response.json({ error: 'Falta el nombre' }, { status: 400 });
  }

  // Ajusta tipos/por defecto según tu schema
  const data = {
    name: String(name).trim(),
    // Si en tu schema estos son Decimal, usa Prisma.Decimal:
    priceDelta: new Prisma.Decimal(priceDelta ?? 0),
    costDelta: new Prisma.Decimal(costDelta ?? 0),
    // Si son Float/Int en tu schema, cambia a Number(...)
    stock: Number(stock ?? 0),
    active: active === undefined ? true : Boolean(active),
  };

  const m = await prisma.modifier.create({ data });
  return Response.json(m, { status: 201 });
}
