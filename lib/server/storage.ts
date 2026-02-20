import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const bucket = process.env.HETZNER_OBJECT_STORAGE_BUCKET || "";
const endpoint = process.env.HETZNER_OBJECT_STORAGE_ENDPOINT || "";
const region = process.env.HETZNER_OBJECT_STORAGE_REGION || "";
const accessKeyId = process.env.HETZNER_OBJECT_STORAGE_ACCESS_KEY || "";
const secretAccessKey = process.env.HETZNER_OBJECT_STORAGE_SECRET_KEY || "";
const publicBase = process.env.HETZNER_OBJECT_STORAGE_PUBLIC_BASE_URL || "";

export function isStorageConfigured() {
  return Boolean(bucket && endpoint && region && accessKeyId && secretAccessKey && publicBase);
}

function createClient() {
  return new S3Client({
    endpoint,
    region,
    forcePathStyle: false,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

export async function uploadToHetznerStorage(file: File, folder: string) {
  if (!isStorageConfigured()) {
    throw new Error("Hetzner Object Storage env vars are missing.");
  }

  const safeFolder = folder.replace(/[^a-zA-Z0-9/_-]/g, "");
  const fileExt = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const key = `${safeFolder}/${Date.now()}-${crypto.randomUUID()}.${fileExt}`;
  const body = Buffer.from(await file.arrayBuffer());

  const client = createClient();
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: file.type || "application/octet-stream",
      ACL: "public-read",
    })
  );

  return `${publicBase.replace(/\/$/, "")}/${key}`;
}
