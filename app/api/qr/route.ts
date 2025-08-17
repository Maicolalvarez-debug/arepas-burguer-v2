export const runtime = 'nodejs';
import QRCode from 'qrcode';

export async function POST(req: Request){
  const { ids } = await req.json();
  const base = process.env.BASE_URL || '';
  const qrs = await Promise.all((ids||[]).map(async (id: string) => {
    const url = `${base}/menu?table=${encodeURIComponent(id)}`;
    const dataUrl = await QRCode.toDataURL(url);
    return { id, dataUrl };
  }));
  return Response.json({ qrs });
}
