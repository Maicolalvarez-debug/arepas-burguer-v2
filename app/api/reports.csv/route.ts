export const dynamic = 'force-dynamic'
import { NextRequest as Req, NextResponse as Res } from 'next/server'

export async function GET(req: Req) {
  const url = new URL(req.url); const qs = url.search
  const api = await fetch(`${url.origin}/api/reports${qs}`, { cache: 'no-store' })
  const data = await api.json()
  const rows = [['label','gross','net','cost','profit'], ...data.series.map((s:any)=>[s.label,s.gross,s.net,s.cost,s.profit])]
  const csv = rows.map(r=>r.join(',')).join('\n')
  return new Res(csv, { headers: { 'Content-Type':'text/csv; charset=utf-8', 'Content-Disposition':'attachment; filename="reports.csv"' } })
}
