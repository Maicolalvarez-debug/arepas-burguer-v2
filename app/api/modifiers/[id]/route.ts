
import { NextResponse } from 'next/server'; import { prisma } from '@/lib/prisma';
export async function POST(req: Request, { params }: { params: { id: string } }){
  const id = Number(params.id); const fd = await req.formData(); const method = (fd.get('_method') as string) || 'PUT';
  if (method==='DELETE'){ await prisma.modifier.delete({ where:{ id } }); return NextResponse.redirect(new URL('/admin/modifiers', req.url)); }
  await prisma.modifier.update({ where:{ id }, data:{
    name: String(fd.get('name')||''), priceDelta: Number(fd.get('priceDelta')||0),
    costDelta: Number(fd.get('costDelta')||0), stock: Number(fd.get('stock')||0)
  }}); return NextResponse.redirect(new URL('/admin/modifiers', req.url));
}
