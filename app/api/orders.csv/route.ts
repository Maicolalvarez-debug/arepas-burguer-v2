
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const printed = searchParams.get('printed');
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const where:any = {};
  if (printed !== null) where.printed = printed === 'true';
  if (from || to) where.createdAt = {};
  if (from) (where.createdAt as any).gte = new Date(from as string);
  if (to) (where.createdAt as any).lte = new Date(to as string + 'T23:59:59.999Z');

  const orders = await prisma.order.findMany({ where, orderBy: { createdAt: 'asc' } });

  const header = ['id','createdAt','tableCode','gross','discount','net','cost','profit','printed'];
  const rows = [header.join(',')];
  for (const o of orders) {
    const profit = o.net - o.cost;
    rows.push([o.id, o.createdAt.toISOString(), o.tableCode||'', o.gross, o.discount, o.net, o.cost, profit, o.printed ? 'true':'false'].join(','));
  }
  const csv = rows.join('\n');
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="orders.csv"'
    }
  });
}
