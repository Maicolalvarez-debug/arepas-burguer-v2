export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const now = new Date();
    const promo = await prisma.dailyPromo.findFirst({
      where: {
        active: true,
        OR: [
          { startDate: null, endDate: null },
          { startDate: { lte: now }, endDate: null },
          { startDate: null, endDate: { gte: now } },
          { startDate: { lte: now }, endDate: { gte: now } },
        ],
      },
      select: {
        id: true, active: true, startDate: true, endDate: true,
        title: true, description: true, image: true, imageUrl: true,
        price: true, cost: true
      },
    });
    return NextResponse.json(promo);
  } catch (err:any) {
    return NextResponse.json(null, { status: 200 });
  }
}
