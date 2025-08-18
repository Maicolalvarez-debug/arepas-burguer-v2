import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { modifierSchema } from '@/schemas/modifier'

export async function POST(req: Request) {
  try {
    const data = modifierSchema.parse(await req.json())
    const created = await prisma.modifier.create({
      data: {
        name: data.name,
        // map price -> priceDelta (Prisma schema)
        priceDelta: data.price ?? 0,
        costDelta: 0,
        stock: 0,
        active: true,
      },
    })
    return NextResponse.json(created, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}

export async function PUT(req: Request) {
  try {
    const parsed = modifierSchema.extend({
      id: modifierSchema.shape.id!.required(),
    }).parse(await req.json())
    const updated = await prisma.modifier.update({
      where: { id: parsed.id! },
      data: {
        name: parsed.name,
        priceDelta: parsed.price ?? 0,
        // keep other fields unchanged by not setting them explicitly
      },
    })
    return NextResponse.json(updated)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}

export async function DELETE(req: Request) {
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'Falta id' }, { status: 400 })
  await prisma.modifier.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
