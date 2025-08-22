import { prisma } from '@/lib/prisma';
export const dynamic = 'force-dynamic';
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0,0,0,0);
const endOfDay   = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23,59,59,999);
export async function GET(req: Request) {
  const url = new URL(req.url);
  const fromStr = url.searchParams.get('from');
  const toStr = url.searchParams.get('to');
  const today = new Date();
  const from = fromStr ? new Date(fromStr) : new Date(today.getFullYear(), today.getMonth(), 1);
  const to   = toStr ? new Date(toStr) : today;
  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: startOfDay(from), lte: endOfDay(to) } },
    orderBy: { id: 'asc' }
  });
  const header = ['id','createdAt','tableCode','gross','discount','net','cost','profit','printed'];
  const rows = [header.join(',')];
  for (const o of orders) {
    rows.push([o.id, o.createdAt.toISOString(), o.tableCode ?? '', o.gross, o.discount, o.net, o.cost, o.profit, o.printed ? 1 : 0].join(','));
  }
  const csv = rows.join('\n');
  return new Response(csv, { status: 200, headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Cache-Control': 'no-store' } });
}
