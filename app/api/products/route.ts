export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = (searchParams.get('status') || 'active') as 'active' | 'archived' | 'all'
  const q = (searchParams.get('q') || '').trim()
  const categoryId = searchParams.get('categoryId')

  const where: any = {}
  if (status === 'active') where.isActive = true
  if (status === 'archived') where.isActive = false
  if (q) where.name = { contains: q, mode: 'insensitive' }
  if (categoryId) where.categoryId = Number(categoryId)

  let products = await prisma.product.findMany({
    where,
    orderBy: [{ categoryId: 'asc' }, { name: 'asc' }],
  })
  return NextResponse.json(products, { headers: { 'Cache-Control': 'no-store' } })
}
