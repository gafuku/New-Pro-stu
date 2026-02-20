import { NextResponse } from "next/server";
import { db } from "@/lib/server/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("postId") || undefined;
  const status = searchParams.get("status") || undefined;

  const data = await db.answer.findMany({
    where: {
      ...(postId ? { postId } : {}),
      ...(status ? { status } : {}),
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const created = await db.answer.create({
    data: {
      postId: body.postId,
      body: body.body,
      status: body.status || "pending",
      authorName: body.authorName || null,
      authorSchool: body.authorSchool || null,
    },
  });

  return NextResponse.json(created, { status: 201 });
}
