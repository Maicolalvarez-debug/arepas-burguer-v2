import { prisma } from '@/lib/prisma';
export async function GET(){ const list = await prisma.category.findMany({ orderBy: { name: 'asc' } }); return Response.json(list); }
export async function POST(req: Request){ const { name } = await req.json(); const c = await prisma.category.create({ data: { name } }); return Response.json(c); }
