// Simple sales report
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const groupBy = url.searchParams.get('groupBy') ?? 'day'; // 'day' or 'month'
  const fromStr = url.searchParams.get('from');
  const toStr = url.searchParams.get('to');
  const today = new Date();
  const from = fromStr ? new Date(fromStr) : new Date(today.getFullYear(), today.getMonth(), 1);
  const to   = toStr ? new Date(toStr) : today;

  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: from, lte: to } },
    orderBy: { id: 'asc' }
  });

  function labelFor(d: Date) {
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const dd = d.getDate();
    if (groupBy === 'month') return `${y}-${String(m).padStart(2,'0')}`;
    return `${y}-${String(m).padStart(2,'0')}-${String(dd).padStart(2,'0')}`;
  }

  const map = new Map<string, { gross: number; net: number; cost: number; profit: number }>();
  for (const o of orders) {
    const key = labelFor(o.createdAt);
    const prev = map.get(key) ?? { gross: 0, net: 0, cost: 0, profit: 0 };
    prev.gross += o.gross;
    prev.net += o.net;
    prev.cost += o.cost;
    prev.profit += o.profit;
    map.set(key, prev);
  }

  const data = Array.from(map.entries()).map(([label, v]) => ({ label, ...v }));
  return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
}
