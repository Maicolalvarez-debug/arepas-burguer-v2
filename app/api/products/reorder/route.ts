
import { prisma } from '@/lib/prisma';
export async function PUT(req: Request){
  const { ids } = await req.json();
  if(!Array.isArray(ids)) return Response.json({error:'ids inválidos'},{status:400});
  await prisma.$transaction(ids.map((id:number, idx:number)=> prisma.product.update({ where:{id}, data:{ sortOrder: idx } })));
  return Response.json({ok:true});
}
