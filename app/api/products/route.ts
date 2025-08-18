// app/api/products/route.ts
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const products = await prisma.product.findMany({ orderBy: { id: 'asc' } })
  return NextResponse.json(products)
}

export async function POST(req: Request) {
  const body = await req.json()
  const name = String(body.name ?? '').trim()
  const description = body.description ? String(body.description) : null
  const categoryId = Number(body.categoryId)
  const price = Number.parseInt(String(body.price ?? ''), 10)
  const cost = Number.parseInt(String(body.cost ?? ''), 10)
  const stock = Number.parseInt(String(body.stock ?? ''), 10)
  const active = body.active === false ? false : true

  if (!name || !categoryId || Number.isNaN(price) || Number.isNaN(cost) || Number.isNaN(stock)) {
    return NextResponse.json({ error: 'Campos requeridos inválidos' }, { status: 400 })
  }

  const created = await prisma.product.create({
    data: { name, description, categoryId, price, cost, stock, active },
  })
  return NextResponse.json(created, { status: 201 })
}
