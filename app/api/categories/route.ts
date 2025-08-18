// app/api/categories/route.ts
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  // Orden básico por id para compatibilidad
  const categories = await prisma.category.findMany({ orderBy: { id: 'asc' } })
  return NextResponse.json(categories)
}

export async function POST(req: Request) {
  const body = await req.json()
  const name = String(body.name ?? '').trim()
  if (!name) return NextResponse.json({ error: 'name requerido' }, { status: 400 })

  const created = await prisma.category.create({ data: { name } })
  return NextResponse.json(created, { status: 201 })
}
