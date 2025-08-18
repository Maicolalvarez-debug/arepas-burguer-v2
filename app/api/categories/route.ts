import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest){
  const form = await req.formData();
  const name = String(form.get('name'));
  await prisma.category.create({ data: { name } });
  return NextResponse.redirect(new URL('/admin/categories', req.url));
}
