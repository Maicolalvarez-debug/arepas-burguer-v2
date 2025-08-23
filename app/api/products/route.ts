export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = ((searchParams.get('status') || 'all') as 'active'|'archived'|'all')
  const q = (searchParams.get('q') || '').trim()
  const categoryId = searchParams.get('categoryId')

  const baseWhere: any = {}
  if (q) baseWhere.name = { contains: q, mode: 'insensitive' }
  if (categoryId) baseWhere.categoryId = Number(categoryId)

  let where: any = { ...baseWhere }
  if (status === 'active') where = { ...baseWhere, OR: [{ isActive: true }, { isActive: null as any }] }
  if (status === 'archived') where = { ...baseWhere, isActive: false }
  if (status === 'all') where = baseWhere

  async function safeFind(w: any) {
    try {
      return await prisma.product.findMany({  where: w, include: { category: { select: { name: true } } }, orderBy: [{ categoryId: 'asc' }, { name: 'asc' }] })
    } catch (_e) {
      return await prisma.product.findMany({  include: { category: { select: { name: true } } }, orderBy: [{ categoryId: 'asc' }, { name: 'asc' }] })
    }
  }

  let products = await safeFind(where)
  if (!products.length && status === 'active') {
    products = await safeFind(baseWhere)
  }
  return NextResponse.json(products, { headers: { 'Cache-Control': 'no-store' } })
}
