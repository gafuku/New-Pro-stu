export async function uploadToCloudinary(file: File, folder: string) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary config missing. Check .env.local");
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", uploadPreset);
  form.append("folder", folder);

  const resp = await fetch(url, {
    method: "POST",
    body: form,
  });
  if (!resp.ok) {
    throw new Error(`Cloudinary upload failed: ${resp.status}`);
  }
  const data = await resp.json();
  return data.secure_url as string;
}
