import { NextResponse } from "next/server";
import { db } from "@/lib/server/db";
import { isAdminRequest } from "@/lib/server/adminAuth";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await db.post.findUnique({ where: { id } });

  if (!post || post.status !== "approved") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const updated = await db.post.update({
    where: { id },
    data: {
      status: body.status,
    },
  });

  return NextResponse.json(updated);
}
