export const runtime = 'nodejs';
export async function GET(){ return Response.json({ whatsapp: process.env.WHATSAPP_NUMBER || "" }); }
