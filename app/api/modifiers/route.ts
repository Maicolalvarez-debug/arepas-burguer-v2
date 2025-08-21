
import { prisma } from '@/lib/prisma';

export async function GET() {
  const list = await prisma.modifier.findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] });
  return Response.json(list);
}

export async function POST(req: Request) {
  const { name, priceDelta, costDelta, stock, active } = await req.json();

  if (!name || String(name).trim() === '') {
    return Response.json({ error: 'Falta el nombre' }, { status: 400 });
  }

  const count = await prisma.modifier.count();
  const data = {
    name: String(name).trim(),
    priceDelta: Number(priceDelta ?? 0),
    costDelta: Number(costDelta ?? 0),
    stock: Number(stock ?? 0),
    active: active === undefined ? true : Boolean(active),
    sortOrder: count,
  };

  const m = await prisma.modifier.create({ data });
  return Response.json(m, { status: 201 });
}
