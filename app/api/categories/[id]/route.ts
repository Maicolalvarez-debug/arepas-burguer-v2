import { NextRequest } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  const body = await req.json()
  const name = String(body.name ?? '').trim()
  if (!id || !name) return new Response('Bad Request', { status: 400 })
  const updated = await prisma.category.update({ where: { id }, data: { name } })
  return Response.json(updated)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  if (!id) return new Response('Bad Request', { status: 400 })
  await prisma.category.delete({ where: { id } })
  return new Response(null, { status: 204 })
}
