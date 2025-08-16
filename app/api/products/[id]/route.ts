export const runtime = 'nodejs';
import { prisma } from "@/lib/prisma";
export async function GET(_:Request, { params }:{ params: { id: string } }){
  const id = Number(params.id); const p = await prisma.product.findUnique({ where: { id } });
  if (!p) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 }); return Response.json(p);
}
export async function PUT(req:Request, { params }:{ params: { id: string } }){
  const id = Number(params.id); const data = await req.json(); const updated = await prisma.product.update({ where: { id }, data }); return Response.json(updated);
}
export async function DELETE(_:Request, { params }:{ params: { id: string } }){
  const id = Number(params.id); await prisma.product.delete({ where: { id } }); return Response.json({ ok: true });
}
