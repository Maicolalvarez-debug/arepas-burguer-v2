// app/api/products/[id]/route.ts
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  const body = await req.json()

  const data: any = {}
  if (body.name !== undefined) data.name = String(body.name).trim()
  if (body.description !== undefined) data.description = body.description ? String(body.description) : null
  if (body.categoryId !== undefined) data.categoryId = Number(body.categoryId)
  if (body.price !== undefined) data.price = Number.parseInt(String(body.price), 10)
  if (body.cost !== undefined) data.cost = Number.parseInt(String(body.cost), 10)
  if (body.stock !== undefined) data.stock = Number.parseInt(String(body.stock), 10)
  if (body.active !== undefined) data.active = !!body.active

  if (data.price !== undefined && Number.isNaN(data.price)) return NextResponse.json({ error: 'price inválido' }, { status: 400 })
  if (data.cost !== undefined && Number.isNaN(data.cost)) return NextResponse.json({ error: 'cost inválido' }, { status: 400 })
  if (data.stock !== undefined && Number.isNaN(data.stock)) return NextResponse.json({ error: 'stock inválido' }, { status: 400 })

  const updated = await prisma.product.update({ where: { id }, data })
  return NextResponse.json(updated)
}
