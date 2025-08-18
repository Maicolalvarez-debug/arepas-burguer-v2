import { prisma } from '@/lib/prisma';

export async function GET(_: Request, { params }: { params: { id: string } }){
  const id = Number(params.id);
  const p = await prisma.product.findUnique({
    where: { id },
    include: { modifiers: { include: { modifier: true } } }
  });
  return Response.json(p);
}

export async function PUT(req: Request, { params }: { params: { id: string } }){
  const id = Number(params.id);
  const data = await req.json();
  const { modifierIds = [], ...base } = data;
  await prisma.product.update({ where: { id }, data: base });
  await prisma.productModifier.deleteMany({ where: { productId: id } });
  for(const mid of modifierIds){
    await prisma.productModifier.create({ data: { productId: id, modifierId: mid } });
  }
  return Response.json({ ok: true });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }){
  const id = Number(params.id);
  await prisma.productModifier.deleteMany({ where: { productId: id } });
  await prisma.product.delete({ where: { id } });
  return Response.json({ ok: true });
}
