export const runtime = 'nodejs';
import QRCode from 'qrcode';

export async function POST(req: Request){
  try{
    const { ids, mesa } = await req.json();
    // Resolve base URL
    const baseEnv = process.env.BASE_URL;
    let base = baseEnv && baseEnv.trim().length ? baseEnv : '';
    if(!base){
      const host = req.headers.get('host') || '';
      const proto = host.startsWith('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https';
      base = `${proto}://${host}`;
    }
    const list = Array.isArray(ids) ? ids : [ids];
    const payload = list.map((id:string)=> `${base}/menu?mesa=${encodeURIComponent(id)}`);
    const svg = await QRCode.toString(payload.join('\n'), { type: 'svg', width: 320, margin: 1 });
    return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml' } });
  }catch(e:any){
    return new Response(JSON.stringify({ error: e?.message || 'Error generating QR' }), { status: 500 });
  }
}
