export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const cats = await prisma.category.findMany({ orderBy: [{ id: 'asc' }] })
  return NextResponse.json(cats, { headers: { 'Cache-Control': 'no-store' } })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const name = (body?.name ?? '').toString().trim()
  if (!name) {
    return NextResponse.json(
      { ok: false, error: 'Nombre requerido' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } },
    )
  }
  const created = await prisma.category.create({ data: { name } })
  return NextResponse.json(
    { ok: true, id: created.id },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}
