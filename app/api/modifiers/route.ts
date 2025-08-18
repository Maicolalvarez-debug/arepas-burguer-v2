// app/api/modifiers/route.ts
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

  const data = {
    name: String(name).trim(),
    // En tu schema parecen ser number (no Decimal), así que usamos Number(...)
    priceDelta: Number(priceDelta ?? 0),
    costDelta: Number(costDelta ?? 0),
    stock: Number(stock ?? 0),
    active: active === undefined ? true : Boolean(active),
  };

  const m = await prisma.modifier.create({ data });
  return Response.json(m, { status: 201 });
}
