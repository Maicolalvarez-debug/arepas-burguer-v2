export const runtime = 'nodejs';
import { prisma } from "@/lib/prisma";
export async function GET(_:Request, { params }:{ params: { id: string } }){
  const id = Number(params.id); const m = await prisma.modifier.findUnique({ where: { id } });
  if (!m) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 }); return Response.json(m);
}
export async function PUT(req:Request, { params }:{ params: { id: string } }){
  const id = Number(params.id); const data = await req.json(); const updated = await prisma.modifier.update({ where: { id }, data }); return Response.json(updated);
}
export async function DELETE(_:Request, { params }:{ params: { id: string } }){
  const id = Number(params.id); await prisma.modifier.delete({ where: { id } }); return Response.json({ ok: true });
}
