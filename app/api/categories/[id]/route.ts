
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const { name } = await req.json();
  if (!id || !name || String(name).trim() === '') {
    return Response.json({ error: 'Datos inválidos' }, { status: 400 });
  }
  const updated = await prisma.category.update({ where: { id }, data: { name: String(name).trim() } });
  return Response.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!id) return Response.json({ error: 'ID inválido' }, { status: 400 });
  try {
    await prisma.category.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (e:any) {
    return Response.json({ error: 'No se puede eliminar: categoría en uso' }, { status: 409 });
  }
}
