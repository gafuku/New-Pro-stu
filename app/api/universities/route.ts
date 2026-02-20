import { NextResponse } from "next/server";
import { db } from "@/lib/server/db";
import { isAdminRequest } from "@/lib/server/adminAuth";

export async function GET() {
  const data = await db.university.findMany({
    orderBy: { name: "asc" },
  });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const created = await db.university.create({
    data: {
      name: body.name,
      slug: body.slug,
      info: body.info || null,
      headerTitle: body.headerTitle || null,
      logoUrl: body.logoUrl || null,
      websiteUrl: body.websiteUrl || null,
      locationLabel: body.locationLabel || null,
      latitude: typeof body.latitude === "number" ? body.latitude : null,
      longitude: typeof body.longitude === "number" ? body.longitude : null,
      colleges: Array.isArray(body.colleges) ? body.colleges : [],
    },
  });

  return NextResponse.json(created, { status: 201 });
}
