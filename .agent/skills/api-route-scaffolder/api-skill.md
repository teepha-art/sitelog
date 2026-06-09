# API Route Scaffold Skill

Load this skill when creating or modifying a server action or a route handler in SiteLog. It defines the exact shape every write should have, so they behave consistently whether the user is submitting a report, approving a request, or logging in.

## Before You Start

Read `.agent/rules/architecture.md` and `.agent/rules/security.md`. This skill assumes you know the data flow and the permission check pattern those files define. Everything here implements them.

First decide: **server action or route handler?**

- **Server action** — the default for SiteLog. Use it for every mutation triggered from the authenticated UI: submit report, create issue, update issue status, assign issue, create project, assign/remove supervisor, submit material request, approve/reject/fulfil request, edit profile. The form or button calls the action directly.
- **Route handler** (`src/app/api/.../route.ts`) — only for boundaries a server action cannot serve: authentication (login, signup, logout, password reset) and file upload (the image attachment, Phase 2). Do not create a route handler for a mutation that a server action can do.

Reads are neither — server components query Prisma directly (see architecture.md). Do not build GET route handlers to fetch data for your own pages.

## The Permission Check Order

Every server action and every state-changing route handler follows the same order, from `security.md`. Skipping a step leaks data.

1. **Authenticate** — valid session? If not, 401. Use `getSession()`.
2. **Authorize** — may this role do this action at all? A supervisor calling `approveMaterialRequest` fails here. 403.
3. **Scope** — may this user touch this specific record? Check membership/ownership explicitly against the id. Never trust the id from the client to be in-scope. 403 or 404.
4. **Validate** — parse input with zod. Reject anything off-schema. 400.
5. **Execute** — write through Prisma, fire any notification inline, revalidate the cache.

## Server Action Template

```ts
// src/app/(reports)/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { canSubmitReport, isAssignedToProject } from '@/lib/permissions';

type ActionResult =
  | { ok: true; data?: unknown }
  | { ok: false; error: { code: string; message: string } };

const submitReportSchema = z.object({
  projectId: z.string().uuid(),
  completedWork: z.string().min(1),
  progressPercentage: z.number().int().min(0).max(100),
  delays: z.string().optional(),
  weatherCondition: z.string().optional(),
  notes: z.string().optional(),
});

export async function submitReport(input: unknown): Promise<ActionResult> {
  try {
    // 1. Authenticate
    const session = await getSession();
    if (!session) {
      return { ok: false, error: { code: 'unauthorized', message: 'Please sign in.' } };
    }

    // 2. Authorize — only supervisors submit reports
    if (!canSubmitReport(session.role)) {
      return { ok: false, error: { code: 'forbidden', message: 'You do not have permission to access this resource.' } };
    }

    // 4. Validate (parse before scope so we have a clean projectId)
    const parsed = submitReportSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: { code: 'invalid_input', message: 'Please complete all required fields before submitting.' } };
    }

    // 3. Scope — supervisor must belong to this project
    if (!(await isAssignedToProject(session.userId, parsed.data.projectId))) {
      return { ok: false, error: { code: 'forbidden', message: 'You do not have permission to access this resource.' } };
    }

    // 5. Execute — relies on the unique constraint for duplicate prevention
    try {
      const report = await prisma.dailyReport.create({
        data: {
          projectId: parsed.data.projectId,
          submittedBy: session.userId,
          reportDate: new Date(),
          completedWork: parsed.data.completedWork,
          progressPercentage: parsed.data.progressPercentage,
          delays: parsed.data.delays,
          weatherCondition: parsed.data.weatherCondition,
          notes: parsed.data.notes,
        },
      });

      // Notify the PM inline — no queue, no event bus
      await prisma.notification.create({
        data: {
          recipientId: /* the project's PM id */ '',
          type: 'report_submitted',
          message: `A report was submitted for the project.`,
          relatedEntityId: report.id,
          relatedEntityType: 'daily_report',
        },
      });

      revalidatePath(`/projects/${parsed.data.projectId}`);
      return { ok: true, data: report };
    } catch (e: unknown) {
      // Unique constraint (projectId, submittedBy, reportDate) → duplicate
      if (isUniqueConstraintError(e)) {
        return { ok: false, error: { code: 'duplicate', message: 'A report for this project and date has already been submitted.' } };
      }
      throw e;
    }
  } catch (error) {
    console.error('action.submitReport.failed', { error });
    return { ok: false, error: { code: 'server_error', message: 'Something went wrong. Please try again later.' } };
  }
}
```

The action's job is thin: authenticate, authorize, scope, validate, write, notify, revalidate. If the body grows past this, extract the core into `src/lib/`. Actions that should send the user somewhere on success call `redirect()` at the end; actions that return data let the caller handle the result.

## Route Handler Template (auth and uploads only)

```ts
// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: { code: 'invalid_input', message: 'Please check your input and try again.' } },
        { status: 400 }
      );
    }

    // verify credentials, create session cookie (see security.md), then:
    return NextResponse.json({ ok: true, data: { /* safe user fields */ } });
  } catch (error) {
    console.error('api.auth.login.failed', { error });
    return NextResponse.json(
      { ok: false, error: { code: 'server_error', message: 'Something went wrong. Please try again later.' } },
      { status: 500 }
    );
  }
}
```

## The Rules

**Always validate with zod.** The body, the params, the action arguments all come from outside and are untrusted. TypeScript types do not run at runtime; zod does.

**Always authenticate before authorizing, and authorize before scoping.** "Is this user logged in" is not "may this user do this" is not "may this user touch this record." All three, in order.

**Always return the same envelope.** Success `{ ok: true, data }`. Failure `{ ok: false, error: { code, message } }`. The UI parses one shape everywhere.

**Never return a raw error.** Log the real error server-side; return the sanitized, user-facing message from `design-system.md`. A Prisma error can reveal the schema; a stack trace reveals more.

**HTTP status codes (route handlers):** 200 success, 400 invalid input, 401 unauthenticated, 403 unauthorized, 404 not found, 409 conflict/duplicate, 429 rate limited, 500 server error.

**Notifications are written inline.** When a mutation has a notification trigger (report submitted, issue created, material request submitted — the only three), create the Notification row in the same action. No queue, no background job.

**Revalidate after a mutation.** Call `revalidatePath` (or `revalidateTag`) for the affected view so the dashboard, list, or detail page does not serve stale data.

**Rate limit the auth route handlers** — login, signup, password reset.

## SiteLog Action Map

The mutations to build, each a server action following the template:

- **Projects:** `createProject`, `updateProject`
- **Membership:** `assignSupervisor`, `removeSupervisor`
- **Reports:** `submitReport` (duplicate-guarded by the unique constraint)
- **Issues:** `createIssue`, `assignIssue` (PM), `updateIssueStatus` (PM)
- **Material requests:** `submitMaterialRequest` (supervisor), `approveMaterialRequest` / `rejectMaterialRequest` / `fulfilMaterialRequest` (PM)
- **Profile:** `updateProfile`

Route handlers (only these): `POST /api/auth/login`, `/signup`, `/logout`, `/password-reset`, and `POST /api/attachments` (Phase 2, image upload).

Each PM-only action checks the role in step 2 and the project scope in step 3. Each supervisor action checks project membership and, for reports and requests, ownership of the record being read or changed.

## Common Mistakes

- Building a route handler for a mutation a server action should do. Server actions are the default; route handlers are for auth and uploads only.
- Building GET route handlers to fetch data for your own pages. Query Prisma in a server component instead.
- Skipping zod and trusting TypeScript at runtime.
- Authenticating but forgetting to authorize, or authorizing the role but forgetting to scope the record — letting a user reach another user's data by changing an id.
- Enforcing the one-report-per-day rule only in code instead of relying on the database unique constraint (which also prevents the race).
- Returning a raw Prisma or exception message to the client.
- Forgetting to revalidate after a mutation, so the UI shows stale data.
- Creating a notification for something other than the three real triggers, or adding a queue/background job for notifications.
- Putting heavy logic inline in the action instead of extracting it to `src/lib/`.