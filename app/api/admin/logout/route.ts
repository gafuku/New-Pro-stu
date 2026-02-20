import { NextResponse } from "next/server";
import { clearAdminSession } from "@/lib/server/adminAuth";

export async function POST() {
  await clearAdminSession();
  return NextResponse.json({ ok: true });
}
