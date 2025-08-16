export const runtime = 'nodejs';
import { prisma } from "@/lib/prisma";
export async function POST(req:Request){ const data = await req.json(); const created = await prisma.modifier.create({ data }); return Response.json(created); }
