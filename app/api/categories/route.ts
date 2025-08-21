
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    try {
      const list = await prisma.category.findMany({ orderBy: ([{ sortOrder: 'asc' }, { name: 'asc' }] as any) });
      return NextResponse.json(list);
    } catch {
      const list = await prisma.category.findMany({ orderBy: [{ name: 'asc' }] });
      return NextResponse.json(list);
    }
  } catch (err:any) {
    return NextResponse.json([], { status: 200 });
  }
}
