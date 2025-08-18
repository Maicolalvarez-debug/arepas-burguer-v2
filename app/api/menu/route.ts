import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(){
  const categories = await prisma.category.findMany({ orderBy:{ name:'asc' } });
  const products = await prisma.product.findMany({ orderBy:[{ order:'asc' }, { name:'asc' }] });
  const byCat: Record<number, any[]> = {};
  for (const c of categories){ byCat[c.id] = []; }
  for (const p of products){ if (byCat[p.categoryId]) byCat[p.categoryId].push(p); }
  return NextResponse.json({ categories, productsByCategory: byCat });
}
