// app/api/modifiers/route.ts
import { prisma } from '@/lib/prisma';

export async function GET() {
  const list = await prisma.modifier.findMany({ orderBy: { name: 'asc' } });
  return Response.json(list);
}

export async function POST(req: Request) {
  const { name } = await req.json();
  if (!name || String(name).trim() === '') {
    return Response.json({ error: 'Falta el nombre' }, { status: 400 });
  }
  const m = await prisma.modifier.create({ data: { name: String(name).trim() } });
  return Response.json(m, { status: 201 });
}
