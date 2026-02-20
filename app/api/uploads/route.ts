import { NextResponse } from "next/server";
import { uploadToHetznerStorage } from "@/lib/server/storage";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file");
  const folder = String(formData.get("folder") || "uploads");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  try {
    const url = await uploadToHetznerStorage(file, folder);
    return NextResponse.json({ url });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Upload failed." }, { status: 500 });
  }
}
