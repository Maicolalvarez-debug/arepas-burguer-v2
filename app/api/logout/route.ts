export const runtime = 'nodejs';
import { cookies } from "next/headers";
export async function POST(){ cookies().delete("ab_admin"); return Response.redirect("/"); }
