// app/api/categories/[id]/route.ts
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  const body = await req.json()
  const data: any = {}

  if (body.name !== undefined) data.name = String(body.name).trim()

  const updated = await prisma.category.update({ where: { id }, data })
  return NextResponse.json(updated)
}
