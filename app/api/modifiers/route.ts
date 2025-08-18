// app/api/modifiers/route.ts
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const mods = await prisma.modifier.findMany({ orderBy: { id: 'asc' } })
  return NextResponse.json(mods)
}

export async function POST(req: Request) {
  const b = await req.json()
  const name = String(b.name ?? '').trim()
  const priceDelta = Number.parseInt(String(b.priceDelta ?? ''), 10)
  const costDelta = Number.parseInt(String(b.costDelta ?? ''), 10)
  const stock = Number.parseInt(String(b.stock ?? ''), 10)
  const active = b.active === false ? false : true

  if (!name || Number.isNaN(priceDelta) || Number.isNaN(costDelta) || Number.isNaN(stock)) {
    return NextResponse.json({ error: 'Campos requeridos inválidos' }, { status: 400 })
  }
  const created = await prisma.modifier.create({ data: { name, priceDelta, costDelta, stock, active } })
  return NextResponse.json(created, { status: 201 })
}
