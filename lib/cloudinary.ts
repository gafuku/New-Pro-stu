export async function uploadToCloudinary(file: File, folder: string) {
  const form = new FormData();
  form.append("file", file);
  form.append("folder", folder);

  const resp = await fetch("/api/uploads", {
    method: "POST",
    body: form,
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(text || `Upload failed: ${resp.status}`);
  }

  const data = await resp.json();
  return data.url as string;
}
