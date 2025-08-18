export const runtime = 'nodejs';
import QRCode from 'qrcode';

export async function POST(req: Request){
  const { ids } = await req.json() as { ids: string[] };
  const origin = process.env.BASE_URL || (new URL(req.url)).origin.replace('/api/qr','');
  const svgs: string[] = [];
  for (const id of ids){
    const url = `${origin}/menu?table=${encodeURIComponent(id)}`;
    const svg = await QRCode.toString(url, { type:'svg', margin:2, width:256 });
    svgs.push(`<div style="display:inline-block;margin:12px;text-align:center;">${svg}<div style="margin-top:6px;font-family:system-ui,Segoe UI,Roboto,Arial">Mesa ${id}</div></div>`);
  }
  return new Response(`<!doctype html><meta charset="utf-8"><title>QR Mesas</title><div>${svgs.join('')}</div>`, { headers: { 'Content-Type':'text/html; charset=utf-8' } });
}
