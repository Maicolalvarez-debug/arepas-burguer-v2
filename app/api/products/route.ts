import { prisma } from '@/lib/prisma';

export async function GET(req: Request){
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  const categoryId = searchParams.get('categoryId');
  const where:any = {};
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
    ];
  }
  if (categoryId) where.categoryId = Number(categoryId);
  const list = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: [{ categoryId: 'asc' }, { name: 'asc' }],
  });
  return Response.json(list);
}

export async function POST(req: Request){
  const data = await req.json();
  const { modifierIds = [], ...base } = data;
  const created = await prisma.product.create({ data: base });
  for(const mid of modifierIds){
    await prisma.productModifier.create({ data: { productId: created.id, modifierId: mid } });
  }
  return Response.json(created);
}
