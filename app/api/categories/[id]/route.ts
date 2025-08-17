
import { NextResponse } from 'next/server'; import { prisma } from '@/lib/prisma';
export async function POST(req: Request, { params }: { params: { id: string } }){
  const id = Number(params.id); const fd = await req.formData(); const method = (fd.get('_method') as string) || 'PUT';
  if (method==='DELETE'){ await prisma.category.delete({ where:{ id } }); return NextResponse.redirect(new URL('/admin/categories', req.url)); }
  await prisma.category.update({ where:{ id }, data:{ name: String(fd.get('name')||'') } }); return NextResponse.redirect(new URL('/admin/categories', req.url));
}
