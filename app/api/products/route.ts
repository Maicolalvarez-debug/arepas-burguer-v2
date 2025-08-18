import { NextRequest } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET() {
  const list = await prisma.product.findMany({ orderBy: [{ id: 'asc' }] })
  return Response.json(list)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const name = String(body.name ?? '').trim()
  const description = body.description ? String(body.description) : null
  const categoryId = Number(body.categoryId)
  const price = Number.parseInt(String(body.price ?? '0'), 10)
  const cost = Number.parseInt(String(body.cost ?? '0'), 10)
  const stock = Number.parseInt(String(body.stock ?? '0'), 10)
  const active = body.active === false ? false : true

  if (!name || !categoryId || Number.isNaN(price) || Number.isNaN(cost) || Number.isNaN(stock)) {
    return new Response('Campos requeridos inválidos', { status: 400 })
  }

  const created = await prisma.product.create({
    data: { name, description, categoryId, price, cost, stock, active }
  })
  return Response.json(created)
}
