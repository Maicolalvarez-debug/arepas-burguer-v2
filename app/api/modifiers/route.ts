export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const list = await prisma.modifier.findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] });
    return NextResponse.json(list);
  } catch (err:any) {
    return NextResponse.json([], { status: 200 });
  }
}
