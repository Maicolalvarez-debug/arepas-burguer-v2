import { prisma } from '@/lib/prisma';
export async function GET(){ const list = await prisma.modifier.findMany({ orderBy: { name: 'asc' } }); return Response.json(list); }
export async function POST(req: Request){ const data = await req.json(); const m = await prisma.modifier.create({ data }); return Response.json(m); }
