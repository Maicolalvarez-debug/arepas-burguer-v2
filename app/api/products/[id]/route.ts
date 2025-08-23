import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  try {
    await prisma.product.update({ where: { id }, data: { isActive: false } })
    return NextResponse.json({ ok: true })
  } catch (e:any) {
    return NextResponse.json({ ok: false, error: e?.message || 'delete_failed' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  const data = await req.json()

  // Allow restore with { isActive: true }, or update name/price/etc.
  const allowed: any = {}
  for (const k of ['name', 'description', 'price', 'cost', 'categoryId', 'isActive']) {
    if (k in data) allowed[k] = data[k]
  }
  try {
    const prod = await prisma.product.update({ where: { id }, data: allowed })
    return NextResponse.json(prod)
  } catch (e:any) {
    return NextResponse.json({ ok: false, error: e?.message || 'patch_failed' }, { status: 500 })
  }
}
