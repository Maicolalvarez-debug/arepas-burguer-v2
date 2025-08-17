
import { NextResponse } from 'next/server'; import { prisma } from '@/lib/prisma';
export async function GET(){ const mods = await prisma.modifier.findMany({ orderBy: { name: 'asc' } }); return NextResponse.json(mods); }
export async function POST(req: Request){ const fd = await req.formData();
  await prisma.modifier.create({ data:{
    name: String(fd.get('name')||''), priceDelta: Number(fd.get('priceDelta')||0),
    costDelta: Number(fd.get('costDelta')||0), stock: Number(fd.get('stock')||0), active:true
  }}); return NextResponse.redirect(new URL('/admin/modifiers', req.url));
}
