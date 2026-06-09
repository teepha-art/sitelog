# Database Migration Runner Skill

Load this skill when changing the database schema — adding a model, a column, an index, an enum value, or a constraint. Migrations are the riskiest kind of change because they are the hardest to undo and a bad one can take the app down. Treat every schema change as a serious commit.

## The Stack

SiteLog uses PostgreSQL with Prisma. The schema lives at `prisma/schema.prisma`. Migrations live at `prisma/migrations/`. The Prisma client is regenerated on every migration and imported as a singleton from `src/lib/prisma.ts` — never instantiate `new PrismaClient()` anywhere else.

## The Eight Tables — and No Others

SiteLog has exactly eight tables. Do not create a ninth without explicit developer approval.

```
User              accounts; role is project_manager or site_supervisor; also holds the password-reset fields `reset_code` and `reset_code_expires_at` (both nullable)
Project           a construction project; owned by a PM
ProjectMembership join table linking supervisors (and the PM) to projects
DailyReport       a supervisor's daily site report
Issue             a snag/issue on a project
MaterialRequest   a supervisor's request for materials
Attachment        one image per report or issue (Phase 2)
Notification      in-app notifications to the PM
```

**Explicitly forbidden tables.** Do not create these — they are deliberate non-features:
- `Comment` — no commenting in MVP.
- `AuditLog` — no audit/event logging in MVP.
- `ProjectActivity` — Recent Activity is a read query across existing tables, never a stored table.
- `Plan`, `Subscription`, `Organisation` — no monetisation or multi-tenant infrastructure.

## Enums (define once, reuse)

```prisma
enum Role            { project_manager site_supervisor }
enum ProjectStatus   { active delayed on_hold completed }
enum IssueStatus     { open in_progress resolved }
enum Priority        { low medium high critical }
enum RequestStatus   { pending approved rejected fulfilled }
enum EntityType      { daily_report issue }            // Attachment scope — no material_request
enum NotificationType{ report_submitted issue_created material_request_submitted }
```

Note `EntityType` has only `daily_report` and `issue`. Material requests have no image in MVP, so they are not in this enum. `NotificationType` has exactly the three triggers — no more.

## The Schema

The full field definitions are the source of truth in `docs/prd.md` (Section 9). Build `prisma/schema.prisma` to match it exactly. Key points the agent must not get wrong:

- **Column mapping:** database columns are `snake_case`; map them to `camelCase` in the client with `@map`. Model names are `PascalCase` singular.
- **DailyReport** has a unique constraint on `(project_id, submitted_by, report_date)` — this is what prevents duplicate reports and the submit race. It must be a real database constraint, not just an application check:
  ```prisma
  @@unique([projectId, submittedBy, reportDate])
  ```
- **Attachment** is one image per parent entity, soft delete only (`isDeleted` boolean), referenced by `fileUrl`. `entityType` uses the `EntityType` enum (report or issue only).
- **Notification** has `recipientId` (the PM), a `NotificationType`, a message, and optional `relatedEntityId` / `relatedEntityType`.
- **Foreign keys** match `docs/prd.md`: Project → assigned PM and creator (User); ProjectMembership → Project and User; DailyReport/Issue/MaterialRequest → Project and the acting User(s); etc.
- **Monetisation forward-compatibility:** it is acceptable to allow a future `organizationId` to be added to Project later, but do not add it now. Build only the eight tables as specified.

## The Workflow

Schema changes always follow this sequence:

1. Edit `prisma/schema.prisma`.
2. Run `npx prisma migrate dev --name <descriptive_name>` to generate and apply the migration locally.
3. **Read the generated SQL** in `prisma/migrations/<timestamp>_<name>/migration.sql` end to end. Do not skip this. Prisma is usually right, but "usually" is not "always" — especially for constraints and enum changes.
4. Run the app locally and hit the affected pages to confirm nothing broke.
5. Commit the `schema.prisma` change and the generated migration file together, in the same commit.
6. Deploy. On the deployment target, `npx prisma migrate deploy` applies pending migrations to production.

Never edit a migration that has already been applied anywhere. To fix a mistake, write a new migration that corrects it.

## migrate dev vs migrate deploy

These are not interchangeable.

- **`npx prisma migrate dev`** — development only. Creates the migration and applies it locally, and can reset the local database if prompted. Never run this against production.
- **`npx prisma migrate deploy`** — applies pending migrations without prompting and cannot reset the database. This is the safe command for production, and what runs on deploy.

Never run `npx prisma migrate reset` against anything but a local dev database — it drops and recreates everything.

## Naming Migrations

Use snake_case describing the change: `add_unique_report_per_day`, `add_issue_status_enum`, `add_attachment_table`. Avoid useless names like `update_schema` or `fix`.

## Common Schema Patterns

**Adding a nullable column (safe):**
```prisma
model Project {
  // ...
  closedAt DateTime?   // nullable — existing rows get NULL, no backfill needed
}
```

**Adding a non-nullable column to a table that has rows (careful):** do it in steps — add it nullable, backfill existing rows, then make it non-nullable in a second migration. On a fresh database this does not matter; on a populated one it does.

**Adding a unique constraint:** before adding one to a column with existing data, make sure there are no duplicates already, or the migration fails. The DailyReport `@@unique` is the key example — it is the safety net for duplicate prevention.

**Adding an index:** add one when a query is actually slow, not speculatively — every index costs write performance.
```prisma
model DailyReport {
  // ...
  @@index([projectId, reportDate])   // supports the report list and dashboard queries
}
```

**Renaming (dangerous):** Prisma treats a rename as drop + add, which loses data. For the capstone, pick the right name the first time. If a rename is truly needed, do it manually: add the new column, backfill, switch the app, then drop the old one.

## Data Access Reminders

- All access goes through Prisma's query builder. Raw SQL is allowed only inside migration files. Never `$queryRawUnsafe`, never string-concatenated SQL.
- The client is the singleton from `src/lib/prisma.ts`.
- Every query that returns user data is scoped by access (project membership, ownership) — see security.md. The schema enables this scoping through ProjectMembership and the foreign keys; the queries must use it.

## Common Mistakes

- Creating a forbidden table — Comment, AuditLog, ProjectActivity, Plan, Subscription, Organisation. Recent Activity is a query, not a table.
- Adding a ninth table, or an enum value beyond what is specified (e.g. a fourth issue status, a fourth notification type).
- Putting `material_request` in the Attachment `EntityType` enum — material requests have no image in MVP.
- Enforcing the one-report-per-day rule only in application code instead of the `@@unique` database constraint.
- Editing a migration file after it has been applied. Write a new one instead.
- Adding a non-nullable column to a populated table with no default or backfill, then being surprised when the migration fails.
- Renaming a column via Prisma's default behavior and losing data.
- Running `migrate dev` or `migrate reset` against production.
- Committing a `schema.prisma` change without its generated migration file — the schema change alone migrates nothing.
- Instantiating `new PrismaClient()` outside `src/lib/prisma.ts`.