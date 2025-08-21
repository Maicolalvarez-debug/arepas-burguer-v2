
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    try {
      const list = await prisma.product.findMany({
        orderBy: ([{ sortOrder: 'asc' }, { name: 'asc' }] as any),
        include: { category: true, modifiers: { include: { modifier: true } } }
      });
      return NextResponse.json(list);
    } catch {
      const list = await prisma.product.findMany({
        orderBy: [{ name: 'asc' }],
        include: { category: true, modifiers: { include: { modifier: true } } }
      });
      return NextResponse.json(list);
    }
  } catch (err:any) {
    return NextResponse.json([], { status: 200 });
  }
}
