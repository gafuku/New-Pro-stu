import { NextResponse } from "next/server";
import { isAdminRequest, isAdminConfigured } from "@/lib/server/adminAuth";

export async function GET() {
  if (!isAdminConfigured()) {
    return NextResponse.json({ isAdmin: false, configured: false });
  }

  const isAdmin = await isAdminRequest();
  return NextResponse.json({ isAdmin, configured: true });
}
