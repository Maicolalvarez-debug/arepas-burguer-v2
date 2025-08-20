
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request) {
  const { ids } = await req.json();
  if (!Array.isArray(ids) || !ids.every((n:any)=>Number.isInteger(n))) {
    return Response.json({ error: 'ids inválidos' }, { status: 400 });
  }
  await prisma.$transaction(ids.map((id:number, idx:number) =>
    prisma.category.update({ where: { id }, data: { sortOrder: idx } })
  ));
  return Response.json({ ok: true });
}
