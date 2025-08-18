import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

async function fileToDataUrl(file: File | null): Promise<string | null> {
  if (!file) return null;
  const arrayBuffer = await file.arrayBuffer();
  const buff = Buffer.from(arrayBuffer);
  const base64 = buff.toString('base64');
  const mime = file.type || 'image/png';
  return `data:${mime};base64,${base64}`;
}

export async function POST(req: NextRequest){
  const form = await req.formData();
  const name = String(form.get('name'));
  const price = Number(form.get('price'));
  const cost = Number(form.get('cost') || 0);
  let imageUrl = String(form.get('imageUrl') || '');
  const cropped = String(form.get('imageCropped') || '');
  const file = form.get('image') as unknown as File | null;
  const dataUrl = await fileToDataUrl(file);
  if (cropped) imageUrl = cropped; else if (dataUrl) imageUrl = dataUrl;
  const categoryId = Number(form.get('categoryId'));
  await prisma.product.create({ data: { name, price, cost, imageUrl, categoryId, active: true } });
  return NextResponse.redirect(new URL('/admin/products', req.url));
}
