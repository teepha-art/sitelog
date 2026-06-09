# SiteLog — Implementation Plan

## Overview

Build a construction site reporting & issue tracking platform with two roles (Project Manager, Site Supervisor) and three core workflows (daily reporting, issue tracking, material requests). Next.js App Router, TypeScript, PostgreSQL/Prisma, CSS Modules with design tokens, light mode only.

---

## Phase 1 — Core Product

### Step 1.0: Project Scaffolding

**What:** Initialize Next.js with TypeScript, install dependencies, set up directory structure, move logos to `public/logo/`, configure path aliases and formatting.

**Files created/touched:**
- `package.json`, `tsconfig.json`, `next.config.mjs`, `.prettierrc`
- `src/app/layout.tsx` (root layout — imports design tokens CSS, Google Fonts for Space Grotesk + Inter)
- `src/app/globals.css` (imports `tokens/design-tokens.css`, sets base reset)
- `public/logo/` (move SVGs from `logo/`)
- Empty directory scaffolding: `src/components/ui/`, `src/components/states/`, `src/components/features/`, `src/lib/`, `src/types/`

**Dependencies:** `next`, `react`, `prisma`, `@prisma/client`, `zod`, `bcryptjs`, `jose` (for JWT sessions), `nodemailer` + `@types/nodemailer` (for password-reset email)

**Governs:** `agents.md` (project structure), `architecture.md` (stack), `code-style.md` (formatting)

---

### Step 1.1: Database Schema (Eight Tables)

**What:** Define the complete Prisma schema with all 8 models, all enums, all constraints. Run initial migration.

**Tables:** User, Project, ProjectMembership, DailyReport, Issue, MaterialRequest, Attachment, Notification

**Enums:** Role, ProjectStatus, IssueStatus, Priority, RequestStatus, EntityType, NotificationType

**Key constraints:** Unique on User.email, Project.project_code, DailyReport `@@unique([projectId, submittedBy, reportDate])`, index on `[projectId, reportDate]`

**User model — password-reset fields:** The User model includes two nullable fields for the forgot-password flow:

```prisma
model User {
  // ... all fields from PRD Section 9.1 ...
  resetCode          String?   @map("reset_code")
  resetCodeExpiresAt DateTime? @map("reset_code_expires_at")
}
```

These fields store the 6-digit code and its 15-minute expiry. They are set by the `forgot-password` route handler, verified by the `reset-password` route handler, and cleared on successful reset. No separate table.

**Files created/touched:**
- `prisma/schema.prisma`
- `prisma/migrations/<timestamp>_initial_schema/migration.sql` (generated)
- `src/lib/prisma.ts` (singleton client)

**Governs:** `db-skill.md`, PRD Section 9 (data models), `security.md` (unique constraint for duplicate prevention, password-reset fields)

---

### Step 1.2: Core Library Files

**What:** Create the foundational lib modules that every feature depends on.

**Files created:**
- `src/lib/env.ts` — env var validation: `DATABASE_URL`, `SESSION_SECRET`, `NEXT_PUBLIC_APP_URL`, plus the five SMTP vars (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`). All SMTP vars are required — the app refuses to start without them.
- `src/lib/constants.ts` — domain constants (MAX_FILE_SIZE_BYTES, enums, PROGRESS_MIN/MAX, MIN_TAP_TARGET_PX, RESET_CODE_EXPIRY_MINUTES = 15)
- `src/lib/auth.ts` — session helpers: `createSession()`, `getSession()`, `destroySession()` using httpOnly cookies signed with jose
- `src/lib/permissions.ts` — server-side permission check functions (`canCreateProject`, `canSubmitReport`, `canApproveRequest`, `isAssignedToProject`, `isProjectManager`, etc.)
- `src/lib/validation.ts` — zod schemas for all form inputs (login, signup, forgot-password, reset-password, project, report, issue, material request, profile)
- `src/lib/email.ts` — Nodemailer transporter configured from the SMTP env vars. Exports `sendPasswordResetEmail(to: string, code: string)` — sends the 6-digit code in a simple text/HTML email. This is the only email the app sends.
- `src/types/index.ts` — shared TypeScript types derived from Prisma where possible

**Governs:** `security.md` (auth, permissions matrix, password reset), `code-style.md` (naming, constants), `architecture.md` (email.ts, SMTP env vars)

---

### Step 1.3: UI Primitives (Design System Components)

**What:** Build the reusable component library that every page composes from.

**Components created in `src/components/ui/`:**
- `Button.tsx` + `.module.css` — variants: primary/secondary/ghost/destructive; sizes: sm/md/lg; loading prop; min-height 44px
- `Card.tsx` + `.module.css` — surface bg, 12px radius, outline border
- `Input.tsx` + `.module.css` — label above, error slot below, 44px min-height, 8px radius, primary focus ring
- `Select.tsx` + `.module.css` — same pattern as Input
- `TextArea.tsx` + `.module.css` — same pattern as Input
- `StatusChip.tsx` + `.module.css` — 4px radius, text label + color, maps status/priority to semantic color roles

**Components created in `src/components/states/`:**
- `EmptyState.tsx` + `.module.css` — icon + message + optional action button
- `LoadingState.tsx` + `.module.css` — skeleton rows/cards or spinner
- `ErrorState.tsx` + `.module.css` — message + optional retry

**Governs:** `design-system.md` (tokens, spacing, radius, color roles), `component-builder-skill.md` (template, variants, accessibility)

---

### Step 1.4: Authentication & Onboarding

**What:** Single auth page with conditional login/signup/forgot-password/reset-password forms. Route handlers for all auth endpoints including the full forgot-password flow. First-time experience routing by role.

**Files created/touched:**
- `src/app/(auth)/auth/page.tsx` — server component shell
- `src/app/(auth)/auth/AuthForm.tsx` + `.module.css` — client component with four form states: **login**, **signup**, **forgot-password** (enter email), **reset-password** (enter code + new password). Switching between forms swaps in place — no navigation, no full reload.
- `src/app/(auth)/layout.tsx` — centered card layout, logo at top
- `src/app/api/auth/login/route.ts` — POST: validate input (zod), look up user by email, verify password (bcrypt), update `last_login_at`, create session cookie, return role for redirect
- `src/app/api/auth/signup/route.ts` — POST: validate input (zod), check email uniqueness, hash password (bcrypt), create User row with selected role, create session cookie, return role for redirect
- `src/app/api/auth/logout/route.ts` — POST: destroy session cookie
- `src/app/api/auth/forgot-password/route.ts` — POST: validate email (zod). Always respond with the same success message whether or not the email exists (security: never reveal account existence). If the account exists: generate a cryptographically random 6-digit code, hash or store it on the User row (`reset_code`), set `reset_code_expires_at` to now + 15 minutes, send the code via `lib/email.ts` (`sendPasswordResetEmail`). Rate-limit this endpoint.
- `src/app/api/auth/reset-password/route.ts` — POST: validate input (zod: email, code, new password). Look up user by email, verify `reset_code` matches and `reset_code_expires_at` has not passed. On success: hash the new password, update `password_hash`, clear `reset_code` and `reset_code_expires_at` (single-use), return success. On failure: return a generic error (do not reveal which check failed).
- `src/app/middleware.ts` — protect authenticated routes, redirect unauthenticated users to auth page, allow `/api/auth/*` through

**Auth form flow:**
1. **Login** — email + password → submit → on success redirect to role-appropriate home (PM: `/dashboard`, Supervisor: `/my-projects`)
2. **Sign up** — full name + email + password + role selector (PM / Supervisor) → submit → on success redirect to role-appropriate first-time screen
3. **Forgot password** — email field only → submit → always shows "If an account exists with that email, we've sent a reset code" → form switches to the reset-password view
4. **Reset password** — 6-digit code + new password + confirm password → submit → on success shows "Password reset successfully" and switches to the login form

A logged-in user changing their password (in Settings, Step 1.16) provides their current password — that path does not use the reset code.

**Behaviour:** After signup, PM → empty dashboard; Supervisor → empty My Projects. Role selector on signup (PM or Supervisor). Session cookie: httpOnly, secure in prod, sameSite lax, 30-day expiry.

**Governs:** PRD 7.1 (auth & onboarding, password reset), Section 17 (exact state copy for auth errors), `security.md` (password hashing, session rules, rate limiting, password-reset code flow), `architecture.md` (auth route handlers, email.ts), `design-system.md` (auth page layout from Section 16)

---

### Step 1.5: App Shell & Navigation

**What:** Persistent authenticated layout with sidebar (desktop), bottom nav (mobile), top bar with page title + notification bell placeholder + user menu.

**Files created/touched:**
- `src/app/(dashboard)/layout.tsx` — the shared shell layout; reads session role, renders PM or supervisor nav
- `src/components/features/Sidebar.tsx` + `.module.css` — fixed 240px, logo, nav items, active state with `--color-primary`
- `src/components/features/TopBar.tsx` + `.module.css` — page title, notification bell placeholder, user menu (name + avatar)
- `src/components/features/BottomNav.tsx` + `.module.css` — mobile nav bar, icons + labels
- `src/components/features/UserMenu.tsx` + `.module.css` — client component, name + avatar dropdown with logout

**PM nav items:** Dashboard, Projects, Reports, Issues, Material Requests, Notifications, Team, Settings
**Supervisor nav items:** My Projects, Submit Report, My Reports, My Issues, My Requests, Notifications, Profile

**Route groups sharing this layout:** `(dashboard)` covers all authenticated pages. Sub-groups `(reports)`, `(issues)`, `(materials)`, `(settings)` nest within it.

**Governs:** PRD Section 6 (information architecture), Section 16 (app shell layout), `design-system.md` (sidebar spec, mobile bottom nav), `architecture.md` (persistent shell, no rebuild on nav)

---

### Step 1.6: Landing Page

**What:** Public marketing page at `/`. Hero, problem cards, solution/workflow section, dashboard preview, built-for-field section, final CTA, footer. No pricing section yet (Phase 2).

**Files created/touched:**
- `src/app/(marketing)/page.tsx` — the landing page
- `src/app/(marketing)/page.module.css`
- `src/app/(marketing)/layout.tsx` — public layout (no sidebar), header with logo + Log In + Get Started

**Sections:** Header → Hero (display font headline + subheading + CTA + product visual) → Problem (3 pain-point cards) → Solution (3 workflow rows) → Dashboard preview → Built for the field → Final CTA → Footer

**Dashboard preview:** Use a clean placeholder (e.g. a styled empty container with a subtle "Dashboard preview coming soon" treatment or a CSS-only abstract representation). We will replace this with a real screenshot of the actual dashboard once it exists. Do not generate a mockup image.

**"Get Started" → auth page (signup form). "Log In" → auth page (login form).**

**Governs:** PRD Section 16 (landing page layout), `design-system.md` (typography tokens, spacing, color roles)

---

### Step 1.7: Project Creation & Listing

**What:** PM creates projects; project list page with status filter.

**Files created/touched:**
- `src/app/(dashboard)/projects/page.tsx` — project list (server component, queries Prisma directly)
- `src/app/(dashboard)/projects/page.module.css`
- `src/app/(dashboard)/projects/new/page.tsx` — project creation page shell
- `src/components/features/ProjectForm.tsx` + `.module.css` — client component, single column form
- `src/app/(dashboard)/projects/actions.ts` — server action: `createProject` (auth → authorize PM → validate → create with status=active, PM as assigned_project_manager and created_by → revalidate)
- Supervisor's `src/app/(dashboard)/my-projects/page.tsx` — their scoped project list

**DB tables:** Project, ProjectMembership (PM auto-added on creation)

**Governs:** PRD 7.4 (project creation form/fields), Section 17 (validation/duplicate code messages), `api-skill.md` (server action template), `security.md` (PM-only)

---

### Step 1.8: Supervisor Assignment

**What:** PM searches supervisors by name/email and assigns them to a project. Creates ProjectMembership rows.

**Files created/touched:**
- `src/components/features/SupervisorSearch.tsx` + `.module.css` — client component, search input + results dropdown
- `src/app/(dashboard)/projects/[id]/page.tsx` — project detail (will be expanded in Step 1.10)
- `src/app/(dashboard)/projects/actions.ts` — add `assignSupervisor`, `removeSupervisor` server actions
- `src/app/api/projects/[id]/supervisors/route.ts` — GET route for supervisor search (returns matching users with role=site_supervisor not already assigned)

**DB tables:** ProjectMembership, User (search query)

**Governs:** PRD 7.5 (supervisor assignment flow), Section 17 (no results/already assigned copy), `security.md` (PM-only, scope check)

---

### Step 1.9: Dashboard (KPI Cards + Recent Activity)

**What:** PM's home screen with 5 KPI cards and a Recent Activity list.

**Files created/touched:**
- `src/app/(dashboard)/dashboard/page.tsx` — server component, queries counts + recent activity
- `src/app/(dashboard)/dashboard/page.module.css`
- `src/components/features/KpiCard.tsx` + `.module.css` — label + large number, tappable (Link)
- `src/lib/activity.ts` — `getRecentActivity()` query: union of recent DailyReports, Issues (created + resolved), approved MaterialRequests, sorted by date, top N

**KPI cards:** Active Projects (→ `/projects?status=active`), Delayed Projects (→ `/projects?status=delayed`), Open Issues (→ `/issues?status=open`), Pending Requests (→ `/material-requests?status=pending`), Reports Today (→ `/reports?date=today`)

**First-time PM experience:** All cards show 0, prominent "Create Your First Project" button.

**Governs:** PRD 7.2 (dashboard spec), Section 16 (dashboard layout), Section 17 (empty/error copy), `architecture.md` (Recent Activity is a read query, not a table)

---

### Step 1.10: Project Detail Page

**What:** Project header + 4 tabs (Reports, Issues, Material Requests, Recent Activity), scoped to one project.

**Files created/touched:**
- `src/app/(dashboard)/projects/[id]/page.tsx` — expand with full detail view
- `src/app/(dashboard)/projects/[id]/page.module.css`
- `src/components/features/ProjectHeader.tsx` + `.module.css` — name, code, status chip, location, dates, team size
- Tab content components (initially showing empty states; populated as Steps 1.11–1.13 build the features)

**DB tables:** Project, ProjectMembership (team size count), uses `lib/activity.ts` for project-scoped activity

**Governs:** PRD 7.3 (project detail page), Section 16 (project detail layout), Section 17 (per-tab empty states)

---

### Step 1.11: Daily Reporting

**What:** Report form with localStorage draft, submit action, report list with date filter, report detail view.

**Files created/touched:**
- `src/app/(dashboard)/reports/page.tsx` — report list (server component)
- `src/app/(dashboard)/reports/page.module.css`
- `src/app/(dashboard)/reports/[id]/page.tsx` — report detail view
- `src/app/(dashboard)/reports/submit/page.tsx` — submit report page shell
- `src/components/features/ReportForm.tsx` + `.module.css` — client component; project dropdown (auto-select if one project), completed work, progress %, delays, weather, notes; localStorage auto-save on input; clears on success
- `src/components/features/FilterBar.tsx` + `.module.css` — client component, writes filters to URL search params
- `src/app/(dashboard)/reports/actions.ts` — `submitReport` server action (auth → authorize supervisor → validate → scope check → create report → create notification for PM → revalidate). Catches unique constraint for duplicate prevention.

**DB tables:** DailyReport, Notification (report_submitted trigger)

**Governs:** PRD 7.6 (daily reporting spec, filters, detail fields), Section 17 (duplicate/network/success copy), `api-skill.md` (action template), `security.md` (supervisor only, scope, duplicate constraint)

---

### Step 1.12: Issue Tracking

**What:** Issue form, list with status/priority filters, detail view, PM-only assign and status update.

**Files created/touched:**
- `src/app/(dashboard)/issues/page.tsx` — issue list
- `src/app/(dashboard)/issues/page.module.css`
- `src/app/(dashboard)/issues/[id]/page.tsx` — issue detail
- `src/app/(dashboard)/issues/new/page.tsx` — create issue page
- `src/components/features/IssueForm.tsx` + `.module.css` — client component; project, title, description, priority
- `src/app/(dashboard)/issues/actions.ts` — `createIssue` (both roles), `assignIssue` (PM only), `updateIssueStatus` (PM only, sets resolved_at when resolving). Issue creation fires notification to PM.

**DB tables:** Issue, Notification (issue_created trigger)

**Governs:** PRD 7.7 (issue spec, statuses, priorities, filters, detail fields), Section 17 (empty/error copy), `security.md` (permissions per action)

---

### Step 1.13: Material Requests

**What:** Request form (supervisor), list with status filter, detail view, PM approve/reject/fulfil actions.

**Files created/touched:**
- `src/app/(dashboard)/material-requests/page.tsx` — request list
- `src/app/(dashboard)/material-requests/page.module.css`
- `src/app/(dashboard)/material-requests/[id]/page.tsx` — request detail
- `src/app/(dashboard)/material-requests/new/page.tsx` — submit request page
- `src/components/features/MaterialRequestForm.tsx` + `.module.css` — client component; project, material name, quantity, urgency, notes
- `src/app/(dashboard)/material-requests/actions.ts` — `submitMaterialRequest` (supervisor, fires notification), `approveMaterialRequest`, `rejectMaterialRequest`, `fulfilMaterialRequest` (all PM only)

**DB tables:** MaterialRequest, Notification (material_request_submitted trigger)

**Governs:** PRD 7.8 (request spec, statuses, filters, detail fields), Section 17 (empty/approved/rejected copy), `security.md` (permissions per action)

---

### Step 1.14: Permissions Audit

**What:** Systematic review of every server action and route handler to verify the full authenticate → authorize → scope → validate → execute chain. Not a new feature — a hardening pass.

**Files touched:** All `actions.ts` files, all `route.ts` files, `src/lib/permissions.ts`

**Checks:**
- Every action authenticates with `getSession()`
- Every action checks role before proceeding
- Every action scopes the record (project membership, ownership)
- Every action validates input with zod
- No action returns raw errors
- Supervisor never receives another user's data

**Governs:** `security.md` (full permissions matrix), `api-skill.md` (permission check order)

---

### Step 1.15: Notifications

**What:** NotificationBell in top bar with count badge and dropdown. Three triggers already wired in Steps 1.11–1.13.

**Files created/touched:**
- `src/components/features/NotificationBell.tsx` + `.module.css` — client component; bell icon + count badge; dropdown with 10 most recent notifications; count clears on open; each item tappable to entity
- `src/app/(dashboard)/notifications/page.tsx` — full notifications list page (from sidebar "Notifications" item)
- `src/components/features/TopBar.tsx` — replace placeholder with real NotificationBell

**DB tables:** Notification (read queries)

**Governs:** PRD 7.9 (notification UI, 3 triggers, dropdown content), Section 17 (no notifications copy), `component-builder-skill.md` (NotificationBell spec)

---

### Step 1.16: Settings & Profile

**What:** PM Settings page (name, profile image, password change). Supervisor Profile page (name, profile image only).

**Files created/touched:**
- `src/app/(dashboard)/settings/page.tsx` + `.module.css` — PM settings
- `src/app/(dashboard)/profile/page.tsx` + `.module.css` — supervisor profile
- `src/app/(dashboard)/settings/actions.ts` — `updateProfile`, `changePassword` server actions

**Governs:** PRD 7.10 (settings spec, fields), Section 17 (success/error copy), `security.md` (PM-only settings, both roles edit profile)

---

### Step 1.17: Team Page (PM Only)

**What:** PM views all supervisors and their project assignments.

**Files created/touched:**
- `src/app/(dashboard)/team/page.tsx` + `.module.css`

**DB tables:** User, ProjectMembership (join query)

**Governs:** PRD Section 6.1 (Team nav item), `security.md` (PM-only)

---

## Phase 2 — After Phase 1 Is Complete and Tested

### Step 2.1: Image Attachments

**What:** Single image upload per report and per issue. Vercel Blob storage.

**Files created/touched:**
- `src/lib/storage.ts` — upload to Vercel Blob, validate file bytes, generate filename
- `src/app/api/attachments/route.ts` — POST: authenticated, scoped, validates type + 5MB, stores via storage.ts, creates Attachment row
- `src/components/ui/FileUpload.tsx` + `.module.css` — single image, preview, replace
- Update `ReportForm.tsx` and `IssueForm.tsx` to include FileUpload
- Update report/issue detail views to display attached image

**DB tables:** Attachment (entity_type: daily_report or issue only)

**Governs:** `architecture.md` (upload route handler), `security.md` (file validation, 5MB, scope), `db-skill.md` (Attachment spec), `constants.ts` (MAX_FILE_SIZE_BYTES, ACCEPTED_IMAGE_TYPES)

---

### Step 2.2: Empty & Error States Audit

**What:** Verify every data view uses the shared EmptyState/LoadingState/ErrorState components with exact copy from PRD Section 17.

**Files touched:** All list pages, detail pages, dashboard, project detail tabs

**Governs:** PRD Section 17 (exact state copy), `design-system.md` (three states required on every view)

---

### Step 2.3: Report Filtering by Supervisor

**What:** PM can filter the report list by supervisor (dropdown of supervisors assigned to selected project).

**Files touched:** `FilterBar` on reports page, reports `page.tsx` query

**Governs:** PRD 7.6 (report list filters — supervisor filter PM only)

---

### Step 2.4: Filtering Refinements

**What:** Add assignee and date range filters to issue and material request lists.

**Files touched:** Issue and material request `FilterBar` components, list page queries

**Governs:** PRD 7.7 (issue filters: assignee, date), PRD 7.8 (request filters: date)

---

### Step 2.5: Landing Page Pricing Section

**What:** Three pricing cards with Monthly/Yearly toggle and Starter/Premium toggle. Presentational only — all buttons go to auth page.

**Files touched:** Landing page `page.tsx`, new `PricingSection.tsx` + `.module.css` client component

**Governs:** PRD Section 16 (pricing section spec), `agents.md` (non-negotiable #10: no real billing)

---

## Phase 3 — Polish

### Step 3.1: Mobile Testing & Optimisation

**What:** Test all supervisor workflows on 375px viewport. Verify 44px tap targets, bottom nav, form usability, outdoor contrast (4.5:1).

**Governs:** PRD Section 12 (mobile requirements), `design-system.md` (mobile rules)

---

### Step 3.2: Deployment to Vercel

**What:** Configure Vercel project, set environment variables, run `prisma migrate deploy`, verify production build.

**Governs:** `architecture.md` (environments), `security.md` (env vars)

---

### Step 3.3: README

**What:** Project README with setup instructions, tech stack, env var list, development and deployment commands.

**Files created:** `README.md`

---

## Verification Plan

### After Each Step
- Run `npx prisma migrate dev` (schema steps) or `npm run dev` and visually verify
- Check TypeScript compilation with `npx tsc --noEmit`

### After Phase 1
- Test all 3 workflows end-to-end: report submission, issue lifecycle, material request lifecycle
- Verify permissions: supervisor cannot access PM actions, PM cannot submit reports
- Verify duplicate report prevention
- Verify notification triggers fire correctly
- Verify dashboard KPI counts are accurate
- Test first-time experience for both roles
- Test full forgot-password flow: request code → receive email → enter code → set new password → login with new password
- Verify reset code expiry (reject expired codes) and single-use (reject reused codes)
- Verify forgot-password responds identically for existing and non-existing emails

### After Phase 2
- Test image upload + display on report and issue
- Verify file validation (type, size)
- Verify all empty/error states show correct copy

### After Phase 3
- Full mobile walkthrough of supervisor workflows
- Production deployment smoke test

---

## Resolved Decisions

1. **Session library:** `jose` — confirmed. JWT-based httpOnly cookie sessions, lightweight, no external dependencies beyond jose.

2. **Password reset:** Full forgot-password flow in MVP. 6-digit code emailed via Nodemailer over SMTP. Code stored on the User row (`reset_code` + `reset_code_expires_at`), single-use, 15-minute expiry. No separate table. SMTP credentials via env vars (a free SMTP account like Gmail app-password is fine). See revised Step 1.4 for full specification.

3. **Landing page dashboard preview:** Clean placeholder. Will be replaced with a real screenshot of the actual dashboard once it exists. No generated mockup image.
