export const runtime = 'nodejs';

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(){
  const c = cookies().get("ab_admin");
  if (!c || c.value !== "1") return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 });
  const products = await prisma.product.findMany();
  const modifiers = await prisma.modifier.findMany();
  for (const p of products){
    for (const m of modifiers){
      await prisma.productModifier.upsert({
        where: { productId_modifierId: { productId: p.id, modifierId: m.id } },
        update: {},
        create: { productId: p.id, modifierId: m.id },
      });
    }
  }
  return Response.json({ ok: true });
}
