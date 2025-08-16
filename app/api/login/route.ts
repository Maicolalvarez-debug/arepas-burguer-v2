export const runtime = 'nodejs';
import { cookies } from "next/headers";
export async function POST(req: Request){
  const body = await req.json();
  const pass = (body?.password||"").toString();
  const expected = process.env.ADMIN_PASSWORD || "";
  if (!expected) return new Response(JSON.stringify({ error: "ADMIN_PASSWORD no está configurado" }), { status: 500 });
  if (pass !== expected) return new Response(JSON.stringify({ error: "Contraseña incorrecta" }), { status: 401 });
  cookies().set("ab_admin", "1", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60*60*8 });
  return Response.json({ ok: true });
}
