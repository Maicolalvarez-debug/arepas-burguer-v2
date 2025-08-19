
// app/api/modifiers/[id]/route.ts
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const body = await req.json();
  if (!id) return Response.json({ error: 'ID inválido' }, { status: 400 });

  const data:any = {};
  if (body.name !== undefined) data.name = String(body.name).trim();
  if (body.priceDelta !== undefined) data.priceDelta = Number(body.priceDelta);
  if (body.costDelta !== undefined) data.costDelta = Number(body.costDelta);
  if (body.stock !== undefined) data.stock = Number(body.stock);
  if (body.active !== undefined) data.active = Boolean(body.active);

  const updated = await prisma.modifier.update({ where: { id }, data });
  return Response.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!id) return Response.json({ error: 'ID inválido' }, { status: 400 });
  try {
    await prisma.modifier.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (e:any) {
    return Response.json({ error: 'No se puede eliminar: modificador en uso' }, { status: 409 });
  }
}
