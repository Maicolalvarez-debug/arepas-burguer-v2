import { NextRequest } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  const body = await req.json()

  if (!id) return new Response('Bad Request', { status: 400 })

  const data: any = {}
  if (body.name !== undefined) data.name = String(body.name).trim()
  if (body.description !== undefined) data.description = body.description ? String(body.description) : null
  if (body.categoryId !== undefined) data.categoryId = Number(body.categoryId)
  if (body.price !== undefined) data.price = Number.parseInt(String(body.price), 10)
  if (body.cost !== undefined) data.cost = Number.parseInt(String(body.cost), 10)
  if (body.stock !== undefined) data.stock = Number.parseInt(String(body.stock), 10)
  if (body.active !== undefined) data.active = !!body.active

  const updated = await prisma.product.update({ where: { id }, data })
  return Response.json(updated)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  if (!id) return new Response('Bad Request', { status: 400 })
  await prisma.product.delete({ where: { id } })
  return new Response(null, { status: 204 })
}
