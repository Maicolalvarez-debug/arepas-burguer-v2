import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest, { params }: { params: { id: string } }){
  const id = Number(params.id);
  const form = await req.formData();
  const method = String(form.get('_method') || 'POST').toUpperCase();
  if (method === 'DELETE'){
    await prisma.category.delete({ where: { id } });
    return NextResponse.redirect(new URL('/admin/categories', req.url));
  }
  return NextResponse.json({ ok: true });
}
