import { NextRequest } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function PATCH(req: NextRequest) {
  const { ids } = await req.json() as { ids: number[] }
  if (!Array.isArray(ids) || !ids.length) return new Response('Bad Request', { status: 400 })
  // write order sequentially
  for (let i = 0; i < ids.length; i++) {
    await prisma.category.update({ where: { id: ids[i] }, data: { order: i } })
  }
  return Response.json({ ok: true })
}
