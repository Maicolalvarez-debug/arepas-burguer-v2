export const runtime = 'nodejs';
import { prisma } from "@/lib/prisma";
export async function GET(_:Request, { params }:{ params: { id: string } }){
  const id = Number(params.id); const c = await prisma.category.findUnique({ where: { id } });
  if (!c) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 }); return Response.json(c);
}
export async function PUT(req:Request, { params }:{ params: { id: string } }){
  const id = Number(params.id); const data = await req.json();
  const updated = await prisma.category.update({ where: { id }, data }); return Response.json(updated);
}
export async function DELETE(_:Request, { params }:{ params: { id: string } }){
  const id = Number(params.id); await prisma.category.delete({ where: { id } }); return Response.json({ ok: true });
}
