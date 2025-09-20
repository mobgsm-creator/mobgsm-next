// app/api/debug/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const protocol = req.headers.get("x-forwarded-proto") || "unknown";
  const host = req.headers.get("host");
  const cookies = req.headers.get("cookie");
  const nextauth_url = process.env.NEXTAUTH_URL;

  return NextResponse.json({
    protocol,
    host,
    cookies,
    nextauth_url,
  });
}
