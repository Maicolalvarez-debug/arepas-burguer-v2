
import { NextResponse } from 'next/server';

export async function GET() {
  const res = NextResponse.redirect(new URL('/admin-login', process.env.BASE_URL || 'http://localhost:3000'));
  res.cookies.set('ab_admin', '', { httpOnly: true, path: '/', maxAge: 0 });
  return res;
}
