// app/api/reports.csv/route.ts
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
    const groupBy = (searchParams.get('groupBy') || 'day') as 'day'|'month';

    const today = new Date();
    let from = fromStr ? new Date(fromStr) : new Date(today.getFullYear(), today.getMonth(), 1);
    let to   = toStr   ? new Date(toStr)   : today;

    // where como any para permitir createdAt aunque no esté en el tipo
    const where: any = {};
    where.createdAt = { gte: startOfDay(from), lte: endOfDay(to) };

    // Orden seguro por id
    const orders = await prisma.order.findMany({
      where,
      orderBy: { id: 'asc' },
    });

    function labelFor(d: Date){
      const y = d.getFullYear(); const m = d.getMonth()+1; const day = d.getDate();
      if(groupBy==='month') return `${y}-${String(m).padStart(2,'0')}`;
      return `${y}-${String(m).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    }

    // Agregamos totales por día/mes
    const map = new Map<string, {gross:number, discount:number, net:number, cost:number, profit:number, count:number}>();
    for(const o of orders){
      const anyO = o as any;
      const d = anyO.createdAt ? new Date(anyO.createdAt) : null;
      const key = d ? labelFor(d) : 'sin-fecha';
      const gross = Number(anyO.gross ?? 0);
      const discount = Number(anyO.discount ?? 0);
      const net = Number(anyO.net ?? (gross - discount));
      const cost = Number(anyO.cost ?? 0);
      const profit = Number(anyO.profit ?? (net - cost));
      const prev = map.get(key) || {gross:0, discount:0, net:0, cost:0, profit:0, count:0};
      prev.gross += gross; prev.discount += discount; prev.net += net; prev.cost += cost; prev.profit += profit; prev.count += 1;
      map.set(key, prev);
    }

    const header = ['period','orders','gross','discount','net','cost','profit'];
    const rows: string[] = [header.join(',')];
    // Mantener orden ascendente por etiqueta
    const keys = Array.from(map.keys()).sort();
    for(const k of keys){
      const v = map.get(k)!;
      rows.push([k, v.count, v.gross, v.discount, v.net, v.cost, v.profit].join(','));
    }

    const csv = rows.join('\n');
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="reports_${fromStr || from.toISOString().slice(0,10)}-${toStr || to.toISOString().slice(0,10)}_${groupBy}.csv"`,
      },
    });
  } catch (err:any) {
    return NextResponse.json({ ok:false, error: err?.message || 'Error generando reporte' }, { status: 500 });
  }
}
