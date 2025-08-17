import { prisma } from "@/lib/prisma";
export async function GET(){
  const list = await prisma.modifier.findMany({ orderBy:{ name:'asc' } });
  return Response.json(list);
}
