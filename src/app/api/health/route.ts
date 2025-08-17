import { NextResponse } from 'next/server';

export async function GET() {
  const hasDb = !!process.env.DATABASE_URL;
  return NextResponse.json({
    ok: true,
    prismaClientGenerated: true,
    databaseUrlSet: hasDb,
    tips: hasDb
      ? 'Todo bien. Ejecuta migraciones para crear tablas: `npm run prisma:migrate:deploy` (prod) o `npm run prisma:db:push`.'
      : 'Falta DATABASE_URL en Vercel → Settings → Environment Variables.',
  });
}
