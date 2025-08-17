
import { NextResponse } from 'next/server'; import { prisma } from '@/lib/prisma';
export async function GET(){ const products = await prisma.product.findMany({ include:{ category:true }, orderBy:[{ category:{ name:'asc' }},{ order:'asc' },{ name:'asc' }]}); return NextResponse.json(products); }
export async function POST(req: Request){ const fd = await req.formData(); const created = await prisma.product.create({ data: {
  name: String(fd.get('name')||''), price: Number(fd.get('price')||0), cost: Number(fd.get('cost')||0),
  stock: Number(fd.get('stock')||0), categoryId: Number(fd.get('categoryId')||0),
  description: (fd.get('description') as string) || null, active: true
}}); return NextResponse.redirect(new URL('/admin/products', req.url)); }
