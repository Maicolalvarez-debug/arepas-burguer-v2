export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function startOfLocalDay(d: Date) { const x = new Date(d); x.setHours(0,0,0,0); return x }
function endOfLocalDay(d: Date)   { const x = new Date(d); x.setHours(23,59,59,999); return x }
function ymd(d: Date) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().slice(0,10) }

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const groupBy = (searchParams.get('groupBy') || 'day') as 'day'|'week'|'month'
  const fromStr = searchParams.get('from') || ''
  const toStr = searchParams.get('to') || ''
  const today = new Date()
  const from = fromStr ? new Date(fromStr) : new Date(today.getFullYear(), today.getMonth(), 1)
  const to   = toStr   ? new Date(toStr)   : today

  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: startOfLocalDay(from), lte: endOfLocalDay(to) } },
    orderBy: { createdAt: 'asc' },
  })

  const bucket = new Map<string, { gross:number; net:number; cost:number }>()

  function labelFor(d: Date) {
    const dt = new Date(d.getFullYear(), d.getMonth(), d.getDate())
    if (groupBy === 'month') return ymd(new Date(dt.getFullYear(), dt.getMonth(), 1)).slice(0,7)
    if (groupBy === 'week') {
      const x = new Date(dt); const day = (x.getDay()+6)%7; x.setDate(x.getDate()-day)
      return ymd(x)
    }
    return ymd(dt)
  }

  for (const o of orders) {
    const k = labelFor(o.createdAt as any)
    const b = bucket.get(k) || { gross:0, net:0, cost:0 }
    b.gross += Number((o as any).gross||0)
    b.net   += Number((o as any).net||0)
    b.cost  += Number((o as any).cost||0)
    bucket.set(k,b)
  }
  const labels = Array.from(bucket.keys()).sort()
  const series = labels.map(k => {
    const b = bucket.get(k)!; return { label:k, gross:b.gross, net:b.net, cost:b.cost, profit:b.net-b.cost }
  })
  const totals = series.reduce((a,c)=>({gross:a.gross+c.gross, net:a.net+c.net, cost:a.cost+c.cost, profit:a.profit+c.profit}), {gross:0,net:0,cost:0,profit:0})
  return NextResponse.json({ from: ymd(from), to: ymd(to), groupBy, totals, series }, { headers: { 'Cache-Control': 'no-store' } })
}
