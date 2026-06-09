# agents.md — SiteLog

This file is the entry point for any AI agent working on the SiteLog codebase in Antigravity. Read this first, then load the rule files in `.agent/rules/` and the relevant skill in `.agent/skills/` before taking any action.

## What SiteLog Is

SiteLog is a construction site reporting and issue tracking platform for small-to-mid-size construction firms. A project manager creates a project, assigns supervisors, and monitors everything from a dashboard. A site supervisor opens the app on their phone, submits a daily report, logs issues, and requests materials. That is the whole product. It is not a project planning tool, not a BIM viewer, not an accounting system, not a communication platform. Every feature decision should be measured against one question: does this give the project manager structured visibility into their sites while keeping the supervisor's workflow under three minutes?

## Who We Are Building For

Two users. Both non-technical. Both impatient.

**The Project Manager** runs 2–10 construction sites simultaneously. They currently waste 30–60 minutes every morning chasing updates on WhatsApp. They want one screen that shows them what is happening across all their sites without making a single phone call. They work on desktop and mobile. They are the buyer.

**The Site Supervisor** is on a construction site, on their feet, often in bright sunlight, often on a slow or unstable connection, sometimes wearing gloves. They do not want to fill in forms. They want to submit their report and get back to work. If it takes longer than sending a WhatsApp message, they will stop using SiteLog. They are primarily on mid-range Android or iPhone devices. They are the user whose adoption decides whether the PM keeps paying.

## Tech Stack

- Next.js (App Router) with React and TypeScript
- PostgreSQL for the database
- Prisma as the ORM
- CSS Modules for styling — the project has a `tokens/` folder. Inside it, `design-tokens.css` contains all color and typography values as CSS variables. Before writing any style, check the file explorer for `tokens/design-tokens.css` and reference its variables. Never use Tailwind. Never hardcode colors or font sizes.
- Vercel for deployment
- Light mode only — no dark mode

## Project Structure

```
sitelog/
├── agents.md                               (this file)
├── .agent/
│   ├── rules/                              (always-on rules for every task)
│   │   ├── architecture.md
│   │   ├── code-style.md
│   │   ├── design-system.md
│   │   └── security.md
│   └── skills/                             (load only when relevant to the task)
│       ├── component-builder/skills.md
│       ├── api-route-scaffold/skills.md
│       └── database-migration-runner/skills.md
├── prisma/
│   └── schema.prisma                       (single source of truth for the database)
├── tokens/
│   ├── color-tokens.json                   (source JSON for color tokens)
│   ├── design-tokens.css                   (THE styling file — all CSS variables live here)
│   ├── design-tokens.tokens.json           (source JSON for all tokens)
│   └── generate-tokens.js                  (script that generates design-tokens.css)
├── src/
│   ├── app/
│   │   ├── (marketing)/                (public landing page at / — explains the product, links to sign up / login)
│   │   ├── (auth)/                         (login, signup, password reset — one page, conditional forms)
│   │   ├── (dashboard)/                    (PM dashboard, project list, project detail)
│   │   ├── (reports)/                      (report form, report list, report detail)
│   │   ├── (issues)/                       (issue list, issue detail, issue creation)
│   │   ├── (materials)/                    (material request list, detail, creation)
│   │   ├── (settings)/                     (PM settings, supervisor profile)
│   │   └── api/                            (route handlers — the API layer)
│   │       ├── auth/
│   │       ├── projects/
│   │       ├── notifications/
│   │       └── attachments/
│   ├── components/
│   │   ├── ui/                             (primitives: Button, Card, Input, StatusChip)
│   │   ├── states/                         (EmptyState, LoadingState, ErrorState)
│   │   └── features/                       (KpiCard, ReportForm, IssueTable, FilterBar)
│   ├── lib/
│   │   ├── auth.ts                         (session and role helpers)
│   │   ├── permissions.ts                  (server-side permission checks)
│   │   ├── prisma.ts                       (Prisma client singleton)
│   │   └── validation.ts                   (zod schemas for input validation)
│   └── types/
│       └── index.ts                        (shared TypeScript types)
└── public/                                 (static assets, favicon)
```

## How to Use These Files

**Rules in `.agent/rules/` are always in effect.** Load all four before starting any task. They cover architecture decisions, code style, the design system, and security requirements. Do not override them without explicit permission from the developer.

**Skills in `.agent/skills/` are loaded on demand.** When building a UI component, read `skills/component-builder/skills.md` first. When creating an API route or server action, read `skills/api-route-scaffold/skills.md`. When changing the database schema, read `skills/database-migration-runner/skills.md`. Never skip the skill file and try to work from memory.

## Navigation Structure

Both roles log in through the same page. After login, the app checks the user's role and shows different navigation.

**Project Manager sidebar (desktop) / bottom nav (mobile):**
Dashboard · Projects · Reports · Issues · Material Requests · Notifications · Team · Settings

**Site Supervisor nav:**
My Projects · Submit Report · My Reports · My Issues · My Requests · Notifications · Profile

The supervisor never sees Dashboard, Projects (all), Team, or Settings. They see only their own data, scoped by their project assignments.

## The Three Core Workflows

Everything in SiteLog exists to serve these three loops. Build these first, build them well.

1. **Daily Reporting** — Supervisor submits a structured report from their phone → PM is notified → dashboard updates → PM reviews the report on the project detail page.
2. **Issue Tracking** — Issue created with priority and photo evidence → PM notified → PM assigns and updates status on the issue detail page → issue resolved.
3. **Material Requests** — Supervisor requests materials with quantity and urgency → PM notified → PM approves or rejects on the request detail page → request fulfilled.

## Key Screens

**Public Landing Page** (`/`) — the first thing a logged-out visitor sees. A marketing page that explains what SiteLog is and who it's for, with clear "Sign Up" and "Log In" actions. The full app flow is: landing page → sign up / log in → role-appropriate home (PM dashboard or supervisor My Projects). The agent must build the landing page — the app does not start at the dashboard.

**PM Dashboard** — the PM's home screen after login. Shows 5 KPI cards at the top:
- Active Projects (count, taps to filtered project list)
- Delayed Projects (count, taps to filtered project list)
- Open Issues (count, taps to filtered issue list)
- Pending Requests (count, taps to filtered request list)
- Reports Today (count, taps to filtered report list)

Below the cards, a **Recent Activity** section shows the 5 most recent items across all projects (reports submitted, issues created, issues resolved, requests approved), each tappable.

**Project Detail Page** — where the PM spends most of their time. Shows the project header (name, code, status, location, dates, team size) and four tabs:
- Reports (all reports for this project)
- Issues (all issues for this project)
- Material Requests (all requests for this project)
- Recent Activity (activity scoped to this project only)

**First-Time Experience** — after signup:
- PM sees an empty dashboard with all KPI cards at zero and a prominent "Create Your First Project" button.
- Supervisor sees "My Projects" with a message: "You have not been assigned to any projects yet. Your project manager will add you to a project."

## Non-Negotiables

1. **Eight database tables only.** User, Project, ProjectMembership, DailyReport, Issue, MaterialRequest, Attachment, Notification. Do not create Comment, AuditLog, ProjectActivity, Plan, Subscription, Organisation, or any other table.
2. **All permissions are enforced server-side.** Client-side UI hiding is cosmetic. The API route is the security boundary. See `security.md` for the full permissions matrix.
3. **Draft reports live in browser localStorage, not the database.** There is no draft status column. Form input is auto-preserved in the browser and only reaches the server when the supervisor taps Submit.
4. **One image per report and one image per issue.** Not three, not ten. One. Material requests have no image attachment in MVP.
5. **Three notification triggers only.** Report submitted, issue created, material request submitted. All three go to the PM. No other notifications exist in MVP.
6. **Recent Activity is a read query, not a stored table.** The activity feed on the dashboard and project detail page queries the most recent reports, issues, and approved requests from their existing tables, sorted by date. There is no ProjectActivity table.
7. **Notification dropdown has no read/unread tracking per item.** The bell shows a count badge. Opening the dropdown clears the count. That is the extent of read state in MVP.
8. **CSS Modules and design tokens only.** Before writing any style, check the file explorer for `tokens/design-tokens.css` and reference its CSS variables. Every color, font size, font weight, and font family must come from this file. Never use Tailwind, never use inline styles, never hardcode any value. See `design-system.md`.
9. **Light mode only.** Do not build dark mode. Do not reference `[data-theme="dark"]`.
10. **No monetisation infrastructure.** No billing, no payments, no subscriptions, no plan entities, no feature flags, no usage metering, no limit enforcement. The landing page has a presentational pricing section (marketing UI showing plans and prices, with "Get Started" buttons that go to sign-up) — that is allowed because it builds nothing and enforces nothing. What is forbidden is real billing or plan logic. Plan limits shown on the pricing page are descriptive text only; the app does not enforce them in MVP.
11. **Supervisors sign up for their own accounts.** The PM does not create supervisor accounts. Supervisors sign up, select their role, and wait to be assigned to a project by a PM who searches for them by name or email. No invitation emails, no invite tokens, no invite links. (Password-reset email is separate and IS in scope — a logged-out user can reset their password via an emailed 6-digit code.)
12. **Material requests do not have image attachments in MVP.** The Attachment entity_type enum is limited to `daily_report` and `issue`.

## Build Order

Build in strict sequence. Complete each phase before starting the next.

**Phase 1 — Core product:**
1. Authentication + onboarding (sign up, login, password reset via emailed 6-digit code, role assignment, first-time experience for both roles)
2. Project creation and listing
3. Supervisor assignment to projects (PM searches by name or email, assigns directly)
4. Project dashboard with 5 KPI cards + Recent Activity section
5. Project detail page with Reports, Issues, Requests, and Activity tabs
6. Daily report form, browser draft preservation, submit, report list with date filter, report detail view
7. Issue creation, assignment, status tracking, issue list with status/priority filters, issue detail view
8. Material request submission, approval, rejection, fulfilment, request list with status filter, request detail view
9. Role-based permissions enforcement (server-side, every route)
10. Three in-app notifications (bell icon + count badge + dropdown with recent items)
11. Settings page (PM) and Profile page (Supervisor)
12. Navigation for both roles as defined above

**Phase 2 — after all Phase 1 items are working and tested:**
13. Single image attachment per report and per issue
14. Empty and error states across all views (using exact copy from `design-system.md`)
15. Report filtering by supervisor (PM only)
16. Issue and request filtering refinements (by assignee, by date range)

**Phase 3 — polish:**
17. Mobile experience testing and optimisation
18. Final deployment to Vercel
19. README at project root

**Do not build — these are out of scope for this version:**
- Comment system
- Email notifications for app events (report submitted, issue created, etc. — these are in-app only; note the password-reset email IS in scope, see Phase 1)
- AuditLog / security event logging
- Invitation workflows
- Multi-file attachments
- Material request images
- Dark mode
- Advanced analytics
- Offline mode
- Native mobile app

## When in Doubt

Check the PRD at `docs/prd.md`. It defines every screen, every flow, every state, every field. If `docs/prd.md` and these context files do not cover what you are about to do, ask the developer. Do not guess at permission logic, schema changes, navigation structure, or notification triggers. Small guesses in those areas create bugs that cost more time to fix than asking would have taken.