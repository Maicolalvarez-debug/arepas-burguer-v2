import { NextRequest } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  const body = await req.json()
  if (!id) return new Response('Bad Request', { status: 400 })

  const data: any = {}
  if (body.name !== undefined) data.name = String(body.name).trim()
  if (body.priceDelta !== undefined) data.priceDelta = Number.parseInt(String(body.priceDelta), 10)
  if (body.costDelta !== undefined) data.costDelta = Number.parseInt(String(body.costDelta), 10)
  if (body.stock !== undefined) data.stock = Number.parseInt(String(body.stock), 10)
  if (body.active !== undefined) data.active = !!body.active

  const updated = await prisma.modifier.update({ where: { id }, data })
  return Response.json(updated)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  if (!id) return new Response('Bad Request', { status: 400 })
  await prisma.modifier.delete({ where: { id } })
  return new Response(null, { status: 204 })
}
