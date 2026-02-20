# University Q&A Hub (Next.js + Hetzner PostgreSQL + Hetzner Object Storage)

This app now uses:
- **Hetzner Managed PostgreSQL** for app data
- **Hetzner Object Storage (S3-compatible)** for file uploads

## What changed
- Removed Supabase + Cloudinary coupling.
- Added Next.js API routes for data and uploads.
- Added Prisma for PostgreSQL access.
- Added cookie-based admin session using env credentials.

## 1. Create resources in Hetzner Console
Open [Hetzner Console](https://console.hetzner.com/projects) and in your project:

1. Create a **Managed Database** (PostgreSQL).
2. Create an **Object Storage bucket**.
3. Create Object Storage credentials (access key + secret).

## 2. Configure environment
Create/update `.env.local` in the project root:

```bash
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB_NAME?sslmode=require"

# Admin login for /admin
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="strong-password"
ADMIN_SESSION_TOKEN="long-random-token-string"

# Hetzner Object Storage (S3-compatible)
HETZNER_OBJECT_STORAGE_ENDPOINT="https://fsn1.your-objectstorage.com"
HETZNER_OBJECT_STORAGE_REGION="fsn1"
HETZNER_OBJECT_STORAGE_BUCKET="your-bucket-name"
HETZNER_OBJECT_STORAGE_ACCESS_KEY="your-access-key"
HETZNER_OBJECT_STORAGE_SECRET_KEY="your-secret-key"

# Public URL base for uploaded files
# Example: https://your-bucket-name.fsn1.your-objectstorage.com
HETZNER_OBJECT_STORAGE_PUBLIC_BASE_URL="https://your-public-bucket-url"
```

Important:
- `DATABASE_URL` must point to your Hetzner managed PostgreSQL.
- `HETZNER_OBJECT_STORAGE_PUBLIC_BASE_URL` must be publicly reachable for uploaded images/files.

## 3. Install and generate Prisma client
```bash
npm install
npx prisma generate
```

## 4. Create DB schema in Hetzner PostgreSQL
If this is a fresh database:

```bash
npx prisma db push
```

If you prefer migration files:

```bash
npx prisma migrate dev --name init
```

For production deploy:

```bash
npx prisma migrate deploy
```

## 5. Run app
```bash
npm run dev
```

Open:
- `http://localhost:3000/` for public pages
- `http://localhost:3000/admin` for moderation login

## How the storage + database connect together
- When a user uploads a file, frontend calls `POST /api/uploads`.
- Server uploads that file to Hetzner Object Storage and returns a public URL.
- That URL is stored in PostgreSQL (posts/comments/university logo records) via Prisma.
- Public pages read records from PostgreSQL and render links/images directly from object storage.

## Core implementation files
- Prisma schema: `/Users/feliciensangwa/Documents/New project/prisma/schema.prisma`
- DB client: `/Users/feliciensangwa/Documents/New project/lib/server/db.ts`
- Storage client: `/Users/feliciensangwa/Documents/New project/lib/server/storage.ts`
- Admin cookie auth: `/Users/feliciensangwa/Documents/New project/lib/server/adminAuth.ts`
- API routes: `/Users/feliciensangwa/Documents/New project/app/api/*`

## Troubleshooting
- `500 Upload failed`: check Object Storage env vars and bucket ACL/public access.
- `401 Unauthorized` on admin routes: verify `ADMIN_*` env values and log in again.
- Prisma connection errors: verify `DATABASE_URL`, IP allowlist/firewall, and SSL mode.
