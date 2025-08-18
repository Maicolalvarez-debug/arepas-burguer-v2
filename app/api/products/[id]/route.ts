// app/api/products/[id]/route.ts
import { prisma } from '@/lib/prisma';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  // En tu schema el id de Product es numérico; convertimos params.id
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return Response.json({ error: 'ID inválido' }, { status: 400 });
  }

  const item = await prisma.product.findUnique({ where: { id } });
  return Response.json(item);
}
