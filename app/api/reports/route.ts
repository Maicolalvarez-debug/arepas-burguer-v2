// app/api/reports/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function startOfDay(d: Date) { const x = new Date(d); x.setUTCHours(0,0,0,0); return x; }
function endOfDay(d: Date)   { const x = new Date(d); x.setUTCHours(23,59,59,999); return x; }

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const fromStr = searchParams.get('from');
    const toStr = searchParams.get('to');
    const groupBy = (searchParams.get('groupBy') || 'day') as 'day' | 'month';

    const today = new Date();
    let from = fromStr ? new Date(fromStr) : new Date(today.getFullYear(), today.getMonth(), 1);
    let to   = toStr   ? new Date(toStr)   : today;

    const where: any = {};
    where.createdAt = { gte: startOfDay(from), lte: endOfDay(to) };

    const orders = await prisma.order.findMany({
      where,
      orderBy: { id: 'asc' }, // evitar createdAt por tipos
    });

    function labelFor(d: Date) {
      const y = d.getFullYear(); const m = d.getMonth() + 1; const day = d.getDate();
      return groupBy === 'month'
        ? `${y}-${String(m).padStart(2,'0')}`
        : `${y}-${String(m).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    }

    const buckets = new Map<string, { orders: number; gross: number; discount: number; net: number; cost: number; profit: number }>();

    for (const o of orders) {
      const anyO = o as any;
      const d = anyO.createdAt ? new Date(anyO.createdAt) : null;
      const key = d ? labelFor(d) : 'sin-fecha';

      const gross = Number(anyO.gross ?? 0);
      const discount = Number(anyO.discount ?? 0);
      const net = Number(anyO.net ?? (gross - discount));
      const cost = Number(anyO.cost ?? 0);
      const profit = Number(anyO.profit ?? (net - cost));

      const prev = buckets.get(key) || { orders: 0, gross: 0, discount: 0, net: 0, cost: 0, profit: 0 };
      prev.orders += 1;
      prev.gross += gross;
      prev.discount += discount;
      prev.net += net;
      prev.cost += cost;
      prev.profit += profit;
      buckets.set(key, prev);
    }

    const data = Array.from(buckets.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([period, v]) => ({ period, ...v }));

    return NextResponse.json({ from: startOfDay(from).toISOString(), to: endOfDay(to).toISOString(), groupBy, data });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Error generando reporte' }, { status: 500 });
  }
}
