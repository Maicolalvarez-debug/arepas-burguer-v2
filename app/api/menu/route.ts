export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
export async function GET() {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  const products = await prisma.product.findMany({
    include: { modifiers: { include: { modifier: true } } },
    orderBy: { name: 'asc' },
  });
  const shaped = products.map(p => ({
    id: p.id, name: p.name, description: p.description, price: p.price, cost: p.cost, stock: p.stock,
    active: p.active, categoryId: p.categoryId, imageUrl: p.imageUrl,
    modifiers: p.modifiers.map(pm => ({ id: pm.modifier.id, name: pm.modifier.name, priceDelta: pm.modifier.priceDelta, costDelta: pm.modifier.costDelta, stock: pm.modifier.stock, active: pm.modifier.active }))
  }));
  return Response.json({ categories, products: shaped });
}
