
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export async function GET() {
  const now = new Date();
  const promo = await prisma.dailyPromo.findFirst({
    where: { active: true, OR: [
      { startDate: null, endDate: null },
      { startDate: { lte: now }, endDate: null },
      { startDate: null, endDate: { gte: now } },
      { startDate: { lte: now }, endDate: { gte: now } },
    ]},
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(promo);
}
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, title, description, price, cost, imageUrl, active, startDate, endDate } = body;
  if (active === true) { await prisma.dailyPromo.updateMany({ data: { active: false }, where: { active: true } }); }
  let promo;
  if (id) {
    promo = await prisma.dailyPromo.update({ where: { id: Number(id) }, data: { title: String(title), description: description ? String(description) : null, price: Number(price || 0), cost: Number(cost || 0), imageUrl: imageUrl ? String(imageUrl) : null, active: Boolean(active), startDate: startDate ? new Date(startDate) : null, endDate: endDate ? new Date(endDate) : null } });
  } else {
    promo = await prisma.dailyPromo.create({ data: { title: String(title), description: description ? String(description) : null, price: Number(price || 0), cost: Number(cost || 0), imageUrl: imageUrl ? String(imageUrl) : null, active: Boolean(active), startDate: startDate ? new Date(startDate) : null, endDate: endDate ? new Date(endDate) : null } });
  }
  return NextResponse.json(promo);
}
