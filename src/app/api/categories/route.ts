
import { prisma } from '@/lib/prisma';

export async function GET() {
  const list = await prisma.category.findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] });
  return Response.json(list);
}

export async function POST(req: Request) {
  const { name } = await req.json();
  if (!name || String(name).trim() === '') {
    return Response.json({ error: 'Falta el nombre' }, { status: 400 });
  }
  const count = await prisma.category.count();
  const c = await prisma.category.create({ data: { name: String(name).trim(), sortOrder: count } });
  return Response.json(c, { status: 201 });
}
