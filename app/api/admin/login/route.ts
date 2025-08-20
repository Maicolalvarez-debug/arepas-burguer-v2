
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { password } = await req.json();
  const adminPass = process.env.ADMIN_PASSWORD || '';
  if (!adminPass) return NextResponse.json({ message: 'ADMIN_PASSWORD no está configurada' }, { status: 500 });
  if (password !== adminPass) return NextResponse.json({ message: 'Contraseña incorrecta' }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set('ab_admin', 'ok', {
    httpOnly: true, path: '/', secure: true, sameSite: 'lax', maxAge: 60*60*8
  });
  return res;
}
