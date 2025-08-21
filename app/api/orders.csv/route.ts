// app/api/orders.csv/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function fmtDate(v: any) {
  try {
    const d = v ? new Date(v) : null;
    return d && !isNaN(d.getTime()) ? d.toISOString() : '';
  } catch {
    return '';
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');

    // Usamos `where` como `any` para permitir createdAt aunque no exista en el tipo
    const where: any = {};
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from + 'T00:00:00.000Z');
      if (to) where.createdAt.lte = new Date(to + 'T23:59:59.999Z');
    }

    // Orden seguro por `id`. Evitamos orderBy por createdAt (puede no existir en tipos)
    const orders = await prisma.order.findMany({
      where,
      orderBy: { id: 'asc' },
    });

    const header = ['id','createdAt','tableCode','gross','discount','net','cost','profit','printed'];
    const rows: string[] = [header.join(',')];

    for (const o of orders) {
      const anyO = o as any;
      const createdAt = fmtDate(anyO.createdAt ?? anyO.created ?? null);
      const tableCode = (anyO.tableCode ?? '').toString().replace(/,/g, ' ');
      const gross = Number(anyO.gross ?? 0);
      const discount = Number(anyO.discount ?? 0);
      const net = Number(anyO.net ?? 0);
      const cost = Number(anyO.cost ?? 0);
      const profit = Number(anyO.profit ?? (net - cost));
      const printed = Boolean(anyO.printed ?? false);

      rows.push([
        o.id,
        createdAt,
        tableCode,
        gross,
        discount,
        net,
        cost,
        profit,
        printed,
      ].join(','));
    }

    const csv = rows.join('\n');
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="orders${from||to ? `_${from||''}-${to||''}` : ''}.csv"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Error generando CSV' }, { status: 500 });
  }
}
