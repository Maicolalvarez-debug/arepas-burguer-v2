
import { NextResponse } from 'next/server'; import { prisma } from '@/lib/prisma';
export async function GET(){ const cats = await prisma.category.findMany({ orderBy: { name:'asc' } }); return NextResponse.json(cats); }
export async function POST(req: Request){ const fd = await req.formData(); await prisma.category.create({ data:{ name: String(fd.get('name')||'') } }); return NextResponse.redirect(new URL('/admin/categories', req.url)); }
