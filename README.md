# SiteLog

SiteLog is a mobile-first construction site reporting and issue-tracking platform for small-to-mid-size construction firms. Project Managers get real-time visibility across all their sites from a dashboard, while Site Supervisors can submit reports, log issues, and request materials from their phones in the field.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL (via Prisma ORM)
- **Styling:** CSS Modules with a custom design-token system (light mode)
- **Authentication:** Session-based auth with `jose` (httpOnly cookies)
- **Email:** Nodemailer (SMTP) for the password-reset flow
- **File Storage:** Vercel Blob (production) / local `public/uploads` (development)
- **Deployment:** Vercel

## Roles

- **Project Manager** — creates projects, assigns supervisors, monitors a dashboard, and actions issues and material requests.
- **Site Supervisor** — submits daily reports, logs issues, and requests materials from a mobile-friendly interface.

## Features

- **Daily Reporting** — supervisors submit structured daily reports with progress, delays, weather, notes, and an optional photo.
- **Issue Tracking** — create, assign, and move issues through Open → In Progress → Resolved.
- **Material Requests** — supervisors request materials; PMs approve, reject, or mark fulfilled.
- **Notifications** — both roles receive in-app notifications (PMs on submissions; supervisors on assignment and on status changes to their items).
- **Role-Based Access Control** — all permissions enforced server-side.
- **Recent Activity Feed** — aggregated updates on the dashboard and project pages.
- **Password Reset** — code-based reset via email (6-digit code, 15-minute expiry).
- **Mobile-First** — designed for supervisors working on phones in the field.

## Local Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd sitelog
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

Create a `.env` file in the project root with the following:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/sitelog"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Authentication (must be at least 32 characters)
SESSION_SECRET="your-super-secret-session-key-at-least-32-chars"

# Email (Nodemailer / SMTP) — for password reset
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="your-email@example.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM="SiteLog <noreply@example.com>"

# File storage (Vercel Blob) — required for image uploads in production
BLOB_READ_WRITE_TOKEN="your-vercel-blob-read-write-token"
```

> In local development, image uploads fall back to the `public/uploads` folder, so a real Blob token is only required for production.

### 4. Database setup

Make sure a PostgreSQL database is running, then apply the schema:

```bash
npx prisma migrate dev
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Use `localhost` rather than your local network IP, so session cookies are accepted.

## Available Scripts

- `npm run dev` — start the development server
- `npm run build` — create a production build
- `npm run start` — run the production build
- `npm run lint` — run ESLint

## Deployment (Vercel)

SiteLog is built to deploy on [Vercel](https://vercel.com/). Note that a few things that work locally need configuring for production:

1. Push the code to a Git repository and import the project into Vercel.
2. Set up a hosted PostgreSQL database (e.g. Vercel Postgres, Neon, or Supabase) and set `DATABASE_URL` in Vercel.
3. Add a Vercel Blob store and set `BLOB_READ_WRITE_TOKEN` (required for image uploads in production — the local folder fallback does not work on Vercel).
4. Configure the remaining environment variables in the Vercel dashboard (`SESSION_SECRET`, `NEXT_PUBLIC_APP_URL`, and the SMTP settings).
5. Run database migrations against the production database with `npx prisma migrate deploy` (run manually, or add it to your build step).
6. Deploy.

## Project Structure

```
src/
  app/            # App Router routes (marketing, auth, app pages, API routes)
  components/     # ui primitives, state components, layout, feature components
  lib/            # auth, permissions, validation, email, prisma, storage, activity
  types/          # shared TypeScript types
prisma/
  schema.prisma   # database schema (8 models)
tokens/
  design-tokens.css   # design-token CSS variables
public/
  logo/           # logo SVGs
```