// app/api/modifiers/[id]/route.ts
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  const b = await req.json()
  const data: any = {}

  if (b.name !== undefined) data.name = String(b.name).trim()
  if (b.priceDelta !== undefined) data.priceDelta = Number.parseInt(String(b.priceDelta), 10)
  if (b.costDelta !== undefined) data.costDelta = Number.parseInt(String(b.costDelta), 10)
  if (b.stock !== undefined) data.stock = Number.parseInt(String(b.stock), 10)
  if (b.active !== undefined) data.active = !!b.active

  const updated = await prisma.modifier.update({ where: { id }, data })
  return NextResponse.json(updated)
}
