import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request){
  const body = await req.json();
  const { ids } = body as { ids: number[] };
  if (!Array.isArray(ids)) return NextResponse.json({ ok:false, error:'ids required' }, { status: 400 });
  for (let i=0;i<ids.length;i++){
    await prisma.product.update({ where: { id: ids[i] }, data: { order: i } });
  }
  return NextResponse.json({ ok:true });
}
