import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ ok: false, error: 'DATABASE_URL no está configurado' }, { status: 400 });
  }
  try {
    // Crea categoría y producto demo si no existen
    const cat = await prisma.category.upsert({
      where: { name: 'Hamburguesas' },
      update: {},
      create: { name: 'Hamburguesas' },
    });

    await prisma.product.upsert({
      where: { id: 1 },
      update: {},
      create: {
        name: 'Clásica',
        description: 'Carne, queso doble crema, jamón, vegetales.',
        price: 20000,
        cost: 12000,
        stock: 10,
        active: true,
        order: 1,
        categoryId: cat.id,
      },
    });

    return NextResponse.json({ ok: true, message: 'Seed aplicado (demo)' });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Error' }, { status: 500 });
  }
}
