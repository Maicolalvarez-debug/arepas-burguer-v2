import { prisma } from "@/lib/prisma";

export async function GET(){
  const items = await prisma.product.findMany({ orderBy:{ name:'asc' } });
  return Response.json(items);
}
export async function POST(req: Request){
  const data = await req.json();
  const { modifierIds = [], ...rest } = data;
  const created = await prisma.product.create({ data: rest });
  if (Array.isArray(modifierIds) && modifierIds.length){
    await prisma.productModifier.createMany({ data: modifierIds.map((id:number)=> ({ productId: created.id, modifierId: Number(id) })) });
  }
  return Response.json(created);
}
