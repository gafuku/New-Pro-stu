# University Q&A Hub (Next.js + Firestore)

Public Q&A and resources for high school prospects with admin-only moderation.

## Features
- Public read + public submit (no login)
- Admin-only approvals for posts, answers, and comments
- Filters: campus, college, topic, grade level, tags, search
- Attachments: PDF, image, or link
- Admin-managed universities (name, slug, logo, header title, info, location, website, colleges)

## Setup
1. **Create Firebase project**
2. Enable **Authentication** → Email/Password
3. Create **Firestore** database (production mode)
4. Create **Storage** bucket
5. Add a **Web App** in Firebase to get config keys

## Local Dev
```bash
npm install
cp .env.example .env.local
npm run dev
```

## Firestore Rules
Copy `firestore.rules` into Firebase → Firestore → Rules.

## Storage Rules
Copy `storage.rules` into Firebase → Storage → Rules.

## Create Admin User
1. Create a user in Firebase Auth with email/password
2. Add a Firestore doc:
   - Collection: `users`
   - Document ID: `{uid}` (from Firebase Auth)
   - Fields: `{ role: "admin" }`

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
Firestore may prompt you to create composite indexes for:
- `posts`: status + createdAt
- `posts`: status + universitySlug + createdAt
- `answers`: status + createdAt

## Admin Usage
- Visit `/admin`
- Login with admin email/password
- Approve or reject posts and answers

## Public Usage
- `/` shows the mission + university map and university list
- `/university/[slug]` shows approved posts for that university
- `/ask` allows anyone to submit a question/resource
- `/post/[id]` shows approved answers + answer form
