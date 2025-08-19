// src/app/api/admin/secure-example/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return new NextResponse("Forbidden", { status: 403 });
  }
  return NextResponse.json({ ok: true, msg: "Solo ADMIN" });
}
