import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export const runtime = 'nodejs';
export async function GET(){
  try{
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true });
  }catch(err:any){
    return NextResponse.json({ ok:false, error: err?.message||'DB error' }, { status: 500 });
  }
}
