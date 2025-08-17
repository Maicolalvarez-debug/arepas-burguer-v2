import { prisma } from "@/lib/prisma";

export async function GET(_:Request, { params }:{ params:{ id:string }}){
  const id = Number(params.id);
  const item = await prisma.product.findUnique({ where:{ id }, include:{ modifiers:{ include:{ modifier:true } } } });
  return Response.json(item);
}
export async function PUT(req:Request, { params }:{ params:{ id:string }}){
  const id = Number(params.id);
  const data = await req.json();
  const { modifierIds = [], ...rest } = data;
  const upd = await prisma.product.update({ where:{ id }, data: rest });
  await prisma.productModifier.deleteMany({ where:{ productId: id } });
  if (Array.isArray(modifierIds) && modifierIds.length){
    await prisma.productModifier.createMany({ data: modifierIds.map((mid:number)=> ({ productId: id, modifierId: Number(mid) })) });
  }
  return Response.json(upd);
}
export async function DELETE(_:Request, { params }:{ params:{ id:string }}){
  const id = Number(params.id);
  await prisma.productModifier.deleteMany({ where:{ productId: id } });
  await prisma.product.delete({ where:{ id } });
  return Response.json({ ok:true });
}
