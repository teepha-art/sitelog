---
trigger: always_on
---

# Security Rules

SiteLog holds the operational record of real construction projects — who reported what, which issues are open, what was approved and by whom. The whole value of the product is that this record is trustworthy. A security mistake here is not just a bug; it lets one user see or change data that belongs to someone else, and it destroys the accountability the product exists to provide. Every agent working on this codebase follows these rules without exception.

The single most important rule: **the server decides what a user can see and do. The client is never trusted.** Hiding a button or a nav item is cosmetic. The API route, the server action, and the database query are the real security boundary.

## Secrets and Configuration

Never commit secrets to the repository. They live in environment variables, loaded through a validated config module (`src/lib/env.ts`) that checks them at boot — if a required variable is missing, the app refuses to start rather than running half-configured.

Required environment variables:

```
DATABASE_URL              PostgreSQL connection string
SESSION_SECRET            secret used to sign session cookies
NEXT_PUBLIC_APP_URL       the app's public URL
BLOB_READ_WRITE_TOKEN     storage credential for image uploads (Phase 2)
SMTP_HOST                 SMTP server host for sending email (Nodemailer)
SMTP_PORT                 SMTP server port
SMTP_USER                 SMTP account username
SMTP_PASSWORD             SMTP account password / app-password
SMTP_FROM                 the "from" address reset emails are sent from
```

Only variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Never put a secret behind that prefix. The SMTP credentials send the password-reset email (see below); there are no payment keys or webhook secrets in SiteLog.

## Authentication

Passwords are hashed with bcrypt or argon2id before they touch the database. Never store a plaintext password. Never log a password, even while debugging.

Sessions are cookie-based. The session cookie must be:
- `httpOnly: true`
- `secure: true` in production
- `sameSite: 'lax'`
- a reasonable expiration (30 days is the default)

The session carries the user id and role. The session helper in `src/lib/auth.ts` exposes `getSession()` for server components and server actions. Logout invalidates the session server-side, not just by clearing the cookie.

Sessions expire gracefully. When a session expires mid-workflow, the user re-authenticates without losing form data — the daily report form's localStorage draft protects the supervisor's work across a re-login (see architecture.md).

Sign-up: a user provides email, password, and selects their role (Project Manager or Site Supervisor). Role is set at sign-up and is not user-editable afterward. There is no invitation system — supervisors sign up directly and are assigned to projects by a PM.

**Password reset (forgot password).** A logged-out user who cannot sign in can reset their password with an emailed code:
1. The user enters their email. Always respond the same way whether or not the email exists — never reveal whether an account exists.
2. If the account exists, generate a random 6-digit code, store it on the User row (`reset_code`) with a short expiry (`reset_code_expires_at`, 15 minutes), and email it via Nodemailer (see architecture.md).
3. The user enters the code in the app (no external link — the flow stays in the app). Verify it matches and has not expired.
4. On success, let them set a new password; hash it, clear `reset_code` and `reset_code_expires_at`.

The code is single-use and expires. Rate-limit reset requests. A logged-in user changing their password (in Settings) must provide their current password — that path does not use a code.

## The Two Roles and Their Scope

SiteLog has exactly two roles. Every permission decision comes down to which role the session holds and which records they are scoped to.

- **Project Manager** — can create projects, assign supervisors, see all data across the projects they manage, and action issues and material requests. The PM is the only role that approves, rejects, assigns, and updates status.
- **Site Supervisor** — scoped to the projects they are assigned to via ProjectMembership. They submit reports, create issues, and submit material requests. They see their own reports and their own requests, and the issues on their projects. They never see other supervisors' data, never see projects they are not assigned to, and never perform any PM-only action.

## Permissions Matrix

Enforce every one of these server-side, on the route or server action that performs the action — not only in the UI.

| Action | Project Manager | Site Supervisor |
|---|---|---|
| Create project | Yes | No |
| View a project | Yes (projects they manage) | Yes (projects they are assigned to) |
| Assign / remove supervisors | Yes | No |
| Submit daily report | No | Yes |
| View daily reports | Yes (all on their projects) | Yes (their own only) |
| Create issue | Yes | Yes |
| Assign issue to a team member | Yes | No |
| Update issue status | Yes | No |
| View issues | Yes (all on their projects) | Yes (on their projects) |
| Submit material request | No | Yes |
| Approve / reject request | Yes | No |
| Mark request fulfilled | Yes | No |
| View material requests | Yes (all on their projects) | Yes (their own only) |
| View notifications | Yes (their own) | Yes (their own) |
| Access settings | Yes | No (profile only) |
| Edit own profile | Yes | Yes |

## The Permission Check Pattern

Every server action and every route handler that touches data follows the same order. Skipping a step is how data leaks.

1. **Authenticate.** Is there a valid session? If not, return 401. Use `getSession()`.
2. **Authorize.** Does this role have permission to perform this action at all? A supervisor calling an "approve request" action fails here, regardless of which request. Return 403.
3. **Scope.** Does this specific user have access to this specific record? Check membership and ownership explicitly: the project is one they manage or belong to; the report is their own; the issue is on their project. Never infer access from the URL — a crafted id can point at any row. Return 403 (or 404) if the record is outside their scope.
4. **Validate.** Parse the input with zod. Reject anything that does not match the schema before it reaches business logic. Return 400 on invalid input.
5. **Execute.** Only now perform the database write through Prisma, fire any notification, and revalidate the cache.

A supervisor must never receive another user's data in a payload, even when the UI would hide it. Filter by scope in the query itself — do not fetch everything and trim it on the client.

## Input Validation

Every piece of data entering the app from outside is validated with zod before it touches the database or any logic. This applies to:
- Form submissions (report, issue, material request, project creation, profile)
- Server action arguments
- Route handler request bodies
- URL and query parameters (project id, report id, filter values)
- File uploads

Validation rules come straight from the data model:
- Every required field is required in the schema (report: completed work, progress percentage; issue: title, description, priority; request: material name, quantity, urgency).
- Enums are validated against their allowed values only — project status, issue status, priority, request status, urgency. Reject anything else.
- `progress_percentage` is an integer between 0 and 100. Reject out-of-range values.
- Validation is not the frontend's job. The frontend validates for user experience; the server validates for safety. Both, always.

## Duplicate Prevention

A supervisor can submit only one report per project per date. This is enforced by a unique constraint on `(project_id, submitted_by, report_date)` in the database — not only by an application check, which can race. When a duplicate submission hits the constraint, catch it and return the user-facing message "A report for this project and date has already been submitted." Do not create a second row.

## File Upload Security

Image upload is a Phase 2 feature (one image per report, one per issue, none for material requests). When built:

- Accept only `image/jpeg`, `image/png`, `image/webp`, and `application/pdf`, validated by the actual file bytes, not the client-provided MIME type.
- Enforce the 5MB maximum (`MAX_FILE_SIZE_BYTES` from `src/lib/constants.ts`).
- One file per entity — do not accept or loop over multiple files.
- Store the file in the configured object storage via `src/lib/storage.ts` with a generated filename. Never use the client's filename. Never store on the filesystem.
- Reference the stored file by URL in the Attachment table. Deletion is a soft delete (`is_deleted = true`), never a hard delete.
- The upload route is authenticated and scoped like any other — a user can only attach to a report or issue they have access to.

## Cross-Cutting Web Security

- **SQL injection:** all database access goes through Prisma's query builder, which parameterizes. Never use `$queryRawUnsafe` or string-concatenated SQL. Raw SQL is allowed only in migration files.
- **XSS:** React escapes rendered strings by default. Do not use `dangerouslySetInnerHTML`. Never put an unvalidated user-supplied URL into an `href` or `src`.
- **CSRF:** server actions include built-in CSRF protection. Route handlers that change state verify the request origin matches the app and rely on the `sameSite: 'lax'` cookie.
- **Rate limiting:** apply a rate limit to login, sign-up, and password reset to slow credential-stuffing and abuse.

## Logging

Log enough to debug an incident, never enough to leak user data.
- Log the action, the actor's user id, and the outcome — e.g. `report.submitted { userId, projectId }`.
- Log full errors server-side.
- Never log passwords, session tokens, the session secret, or storage credentials.
- Never return a raw exception, stack trace, or Prisma error to the client. Return the sanitized, user-facing message from design-system.md.

## Not in MVP Scope

These are deliberately out of scope. Do not build them.
- **AuditLog / security event logging** — no audit table, no event log. Post-MVP.
- **Multi-factor authentication** — single-factor email + password only.
- **Invitation tokens / email-link onboarding** — supervisors self-sign-up and are assigned directly. (Note: password-reset email IS in scope — see Authentication.)
- **Password rotation policies, account lockout thresholds, SSO** — none in MVP.
- **Role management beyond the two fixed roles** — no admin tier, no custom roles, no permission editing.

## Common Mistakes

- Enforcing permissions only in the UI (hiding a button) and forgetting the server check. Any user can call the action directly.
- Authenticating but not authorizing — checking that someone is logged in but not that their role may perform the action.
- Authorizing the role but not scoping the record — letting a supervisor open another supervisor's report by changing the id in the URL.
- Fetching all rows and filtering on the client. Scope the query on the server.
- Trusting the client-provided file type instead of validating the actual bytes.
- Enforcing the one-report-per-day rule only in application code, not as a database constraint.
- Returning a raw Prisma or exception message to the user.
- Putting a secret behind the `NEXT_PUBLIC_` prefix.