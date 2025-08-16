export const runtime = 'nodejs';
import { prisma } from "@/lib/prisma";
export async function GET(){ const cats = await prisma.category.findMany({ orderBy: { name: 'asc' } }); return Response.json(cats); }
export async function POST(req:Request){ const data = await req.json(); const created = await prisma.category.create({ data }); return Response.json(created); }
