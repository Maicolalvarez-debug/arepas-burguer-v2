export const runtime='nodejs'; import { cookies } from "next/headers"; import { exec } from "node:child_process"; import { promisify } from "node:util";
const $ = promisify(exec);
export async function POST(){
  const c = cookies().get("ab_admin"); if (!c || c.value!=='1') return new Response(JSON.stringify({ error:'No autorizado' }), { status: 401 });
  try{
    await $(`npx prisma db push --accept-data-loss`);
    await $(`npx ts-node --transpile-only prisma/seed.ts`);
    return Response.json({ ok:true });
  }catch(e:any){ return new Response(JSON.stringify({ error: e?.message || 'Error ejecutando seed' }), { status: 500 }); }
}