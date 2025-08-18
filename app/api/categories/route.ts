import { NextRequest } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET() {
  const list = await prisma.category.findMany({ orderBy: [{ order: 'asc' }, { id: 'asc' }] })
  return Response.json(list)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const name = String(body.name ?? '').trim()
  if (!name) return new Response('Nombre requerido', { status: 400 })
  const created = await prisma.category.create({ data: { name } })
  return Response.json(created)
}
