# UMich Q&A Hub (Next.js + Firestore)

Public Q&A and resources for UMich prospects with admin-only moderation.

## Features
- Public read + public submit (no login)
- Admin-only approvals for posts and answers
- Filters: campus, school, topic, grade level, tags, search
- Attachments: PDF, image, or link

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
- `title`, `body`, `status`, `resourceType`, `campus`, `school`, `topic`, `gradeLevel`, `tags[]`
- `authorName`, `authorSchool`, `attachments[]`

### answers
- `postId`, `body`, `status`, `authorName`, `authorSchool`

## Indexes
Firestore may prompt you to create composite indexes for:
- `posts`: status + createdAt
- `answers`: status + createdAt

## Admin Usage
- Visit `/admin`
- Login with admin email/password
- Approve or reject posts and answers

## Public Usage
- `/` shows approved posts only
- `/ask` allows anyone to submit a question/resource
- `/post/[id]` shows approved answers + answer form
