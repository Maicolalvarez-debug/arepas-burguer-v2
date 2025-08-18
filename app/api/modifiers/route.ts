import { NextRequest } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET() {
  const list = await prisma.modifier.findMany({ orderBy: [{ id: 'asc' }] })
  return Response.json(list)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const name = String(body.name ?? '').trim()
  const priceDelta = Number.parseInt(String(body.priceDelta ?? '0'), 10)
  const costDelta  = Number.parseInt(String(body.costDelta ?? '0'), 10)
  const stock      = Number.parseInt(String(body.stock ?? '0'), 10)
  const active     = body.active === false ? false : true

  if (!name || Number.isNaN(priceDelta) || Number.isNaN(costDelta) || Number.isNaN(stock)) {
    return new Response('Campos requeridos inválidos', { status: 400 })
  }

  const created = await prisma.modifier.create({
    data: { name, priceDelta, costDelta, stock, active }
  })
  return Response.json(created)
}
