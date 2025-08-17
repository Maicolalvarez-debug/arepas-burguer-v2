
import { NextResponse } from 'next/server'; import { prisma } from '@/lib/prisma';
export async function POST(req: Request, { params }: { params: { id: string } }){
  const id = Number(params.id); const fd = await req.formData(); const method = (fd.get('_method') as string) || 'PUT';
  if (method==='DELETE'){ await prisma.product.delete({ where:{ id } }); return NextResponse.redirect(new URL('/admin/products', req.url)); }
  await prisma.product.update({ where:{ id }, data:{
    name: String(fd.get('name')||''), price: Number(fd.get('price')||0), cost: Number(fd.get('cost')||0),
    stock: Number(fd.get('stock')||0), categoryId: Number(fd.get('categoryId')||0),
    description: (fd.get('description') as string) || null
  }});
  return NextResponse.redirect(new URL('/admin/products', req.url));
}
