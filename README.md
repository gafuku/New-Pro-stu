# University Q&A Hub (Next.js + Supabase + Cloudinary)

Public Q&A and resources for high school prospects with admin-only moderation.

## Features
- Public read + public submit (no login)
- Admin-only approvals for posts, answers, and comments
- Filters: campus, college, topic, grade level, tags, search
- Attachments: PDF, image, or link
- Admin-managed universities (name, slug, logo, header title, info, location, website, colleges)

## Setup
1. **Create Supabase project**
2. Enable **Auth** → Email/Password
3. Create tables: `universities`, `posts`, `answers`, `comments`, `users`
4. Create a `users` row for your admin (role = `admin`)
5. **Create Cloudinary account** and an unsigned upload preset

## Local Dev
```bash
npm install
cp .env.example .env.local
npm run dev
```

## Supabase Schema (SQL)
```sql
create table if not exists universities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  logoUrl text,
  info text,
  headerTitle text,
  websiteUrl text,
  locationLabel text,
  latitude double precision,
  longitude double precision,
  colleges text[],
  createdAt timestamp with time zone default now()
);

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  status text not null,
  resourceType text not null,
  campus text,
  university text,
  universitySlug text,
  college text,
  topic text,
  gradeLevel text,
  tags text[],
  authorName text,
  authorSchool text,
  attachments jsonb,
  createdAt timestamp with time zone default now()
);

create table if not exists answers (
  id uuid primary key default gen_random_uuid(),
  postId uuid references posts(id) on delete cascade,
  body text not null,
  status text not null,
  authorName text,
  authorSchool text,
  createdAt timestamp with time zone default now()
);

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  postId uuid references posts(id) on delete cascade,
  text text not null,
  status text not null,
  authorName text,
  authorSchool text,
  attachments jsonb,
  createdAt timestamp with time zone default now()
);

create table if not exists users (
  id uuid primary key,
  role text not null
);
```

## Supabase Policies (RLS)
Enable RLS on all tables and create policies:
- `universities`: read for all, write for admins
- `posts/answers/comments`: read approved for all, insert for all, update for admins
- `users`: read for self, update for self

Use a policy like:
```sql
-- Example admin check
create policy \"admins can write\" on posts
for update using (
  exists (select 1 from users where id = auth.uid() and role = 'admin')
);
```

## Create Admin User
1. Create a user in Supabase Auth (email/password)
2. Insert into `users` table:
   - `id`: auth user id
   - `role`: `admin`

## Cloudinary Setup
1. Create an unsigned upload preset
2. Set `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` and `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`

## Data Model
### posts
- `title`, `body`, `status`, `resourceType`, `campus`, `university`, `universitySlug`, `college`, `topic`, `gradeLevel`, `tags[]`
- `authorName`, `authorSchool`, `attachments[]`

### answers
- `postId`, `body`, `status`, `authorName`, `authorSchool`

### comments
- `postId`, `text`, `status`, `authorName`, `authorSchool`, `attachments[]`

### universities
- `name`, `slug`, `logoUrl`, `info`, `headerTitle`, `websiteUrl`, `locationLabel`, `latitude`, `longitude`, `colleges[]`

## Indexes
Supabase indexes recommended:
- `posts` on `(status, createdAt)`
- `posts` on `(status, universitySlug, createdAt)`
- `answers` on `(status, createdAt)`
- `comments` on `(status, createdAt)`

## Admin Usage
- Visit `/admin`
- Login with admin email/password
- Approve or reject posts and answers

## Public Usage
- `/` shows the mission + university map and university list
- `/university/[slug]` shows approved posts for that university
- `/ask` allows anyone to submit a question/resource
- `/post/[id]` shows approved answers + answer form
