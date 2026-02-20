import { NextResponse } from "next/server";
import { getAdminConfig, isAdminConfigured, setAdminSession } from "@/lib/server/adminAuth";

export async function POST(req: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "Admin auth is not configured." }, { status: 500 });
  }

  const body = await req.json();
  const { email, password } = body || {};
  const cfg = getAdminConfig();

  if (email !== cfg.email || password !== cfg.password) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  await setAdminSession();
  return NextResponse.json({ ok: true });
}
