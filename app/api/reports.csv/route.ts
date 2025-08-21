
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
function startOfDay(d: Date){ const x=new Date(d); x.setHours(0,0,0,0); return x; }
function endOfDay(d: Date){ const x=new Date(d); x.setHours(23,59,59,999); return x; }
function fmt(d: Date){ return d.toISOString().slice(0,10); }
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const groupBy = (searchParams.get('groupBy') || 'day') as 'day'|'week'|'month';
  const fromStr = searchParams.get('from'); const toStr = searchParams.get('to');
  const today = new Date(); let from = fromStr ? new Date(fromStr) : new Date(today.getFullYear(), today.getMonth(), 1); let to = toStr ? new Date(toStr) : today;
  const orders = await prisma.order.findMany({ where: { createdAt: { gte: startOfDay(from), lte: endOfDay(to) } }, orderBy: { createdAt: 'asc' } });
  function labelFor(d: Date){
    const y = d.getFullYear(); const m = d.getMonth()+1;
    if(groupBy==='month') return `${y}-${String(m).padStart(2,'0')}`;
    if(groupBy==='week'){ const dt = new Date(d.getTime()); const dayNum=(dt.getDay()+6)%7; dt.setDate(dt.getDate()-dayNum+3); const firstThursday=new Date(dt.getFullYear(),0,4); const week=1+Math.round(((dt.getTime()-firstThursday.getTime())/86400000-3+((firstThursday.getDay()+6)%7))/7); return `${dt.getFullYear()}-W${String(week).padStart(2,'0')}`; }
    return fmt(d);
  }
  const bucket = new Map<string,{gross:number,net:number,cost:number}>();
  for(const o of orders){ const k=labelFor(o.createdAt); const b=bucket.get(k)||{gross:0,net:0,cost:0}; b.gross+=o.gross; b.net+=o.net; b.cost+=o.cost; bucket.set(k,b); }
  const labels = Array.from(bucket.keys()).sort();
  const header = ['period','gross','net','cost','profit'];
  const rows = [header.join(',')];
  let totals = {gross:0,net:0,cost:0,profit:0};
  for(const k of labels){ const b=bucket.get(k)!; const profit = b.net - b.cost;
    rows.push([k, b.gross, b.net, b.cost, profit].join(','));
    totals.gross+=b.gross; totals.net+=b.net; totals.cost+=b.cost; totals.profit+=profit;
  }
  rows.push(['TOTALS', totals.gross, totals.net, totals.cost, totals.profit].join(','));
  const csv = rows.join('\n');
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="reports.csv"'
    }
  });
}
