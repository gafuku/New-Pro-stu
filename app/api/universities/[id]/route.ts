import { NextResponse } from "next/server";
import { db } from "@/lib/server/db";
import { isAdminRequest } from "@/lib/server/adminAuth";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const updated = await db.university.update({
    where: { id },
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

  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await db.university.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
