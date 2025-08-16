export const runtime = 'nodejs';
import QRCode from "qrcode";
export async function POST(req: Request){
  const { ids } = await req.json();
  const base = process.env.BASE_URL || "";
  const host = base || "";
  const files: string[] = [];
  for (const id of ids as string[]){
    const url = (host || '') + `/menu?mesa=${encodeURIComponent(id)}`;
    const dataUrl = await QRCode.toDataURL(url, { margin: 1, width: 512 });
    files.push(dataUrl);
  }
  return Response.json({ files });
}
