
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';

export async function POST(req: Request){
  const { password } = await req.json().catch(()=>({}));
  const expected = process.env.ADMIN_PASSWORD || '';
  if(!expected){
    return NextResponse.json({ message: 'ADMIN_PASSWORD no está configurado' }, { status: 500 });
  }
  if(password !== expected){
    return NextResponse.json({ message: 'Contraseña incorrecta' }, { status: 401 });
  }
  const res = NextResponse.json({ ok:true });
  res.cookies.set('ab_admin', 'ok', { httpOnly: true, sameSite:'lax', secure: true, path: '/' });
  return res;
}
