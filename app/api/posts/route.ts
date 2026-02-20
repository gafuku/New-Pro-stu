import { NextResponse } from "next/server";
import { db } from "@/lib/server/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || undefined;
  const universitySlug = searchParams.get("universitySlug") || undefined;

  const data = await db.post.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(universitySlug ? { universitySlug } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();

  const created = await db.post.create({
    data: {
      title: body.title,
      body: body.body,
      status: body.status || "pending",
      resourceType: body.resourceType,
      campus: body.campus || null,
      university: body.university || null,
      universitySlug: body.universitySlug || null,
      college: body.college || null,
      topic: body.topic || null,
      gradeLevel: body.gradeLevel || null,
      tags: Array.isArray(body.tags) ? body.tags : [],
      authorName: body.authorName || null,
      authorSchool: body.authorSchool || null,
      attachments: body.attachments || [],
    },
  });

  return NextResponse.json(created, { status: 201 });
}
