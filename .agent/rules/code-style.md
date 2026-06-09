---
trigger: always_on
---

# Code Style Rules

These are the code-style rules for SiteLog. They exist so the codebase reads the same way no matter who, or which agent, wrote a given file. Consistency matters more than personal preference. When in doubt, match what already exists in the codebase.

## Language

TypeScript everywhere. No JavaScript files in `src/app/`, `src/components/`, or `src/lib/`. Configuration files (`next.config.mjs`, etc.) are the only exceptions. The one deliberate exception in this project is `tokens/generate-tokens.js`, which already exists and converts the design token JSON into `tokens/design-tokens.css` — leave it as it is.

Strict mode is on. Do not disable `strict`, `noImplicitAny`, or `strictNullChecks` to silence an error. Fix the type instead.

Do not use `any`. If you genuinely do not know the shape of something, use `unknown` and narrow it with a type guard. Validate anything from outside the app (form inputs, request bodies, params) with zod — see `security.md`.

## Naming

- Components are `PascalCase` in `PascalCase.tsx` files. `KpiCard.tsx` exports `KpiCard`.
- Utility and lib functions are `camelCase` in `camelCase.ts` files.
- Hooks start with `use` and live alongside the component that uses them, or in a `hooks/` folder if shared.
- Constants that represent fixed configuration are `SCREAMING_SNAKE_CASE` (`MAX_FILE_SIZE_BYTES`, `MAX_PROGRESS`). Other constants are `camelCase`.
- Prisma models are `PascalCase` singular: `User`, `Project`, `DailyReport`, `Issue`, `MaterialRequest`, `Attachment`, `Notification`, `ProjectMembership`. Database columns are `snake_case` in the database, mapped to `camelCase` in the Prisma client with `@map`.
- API route folders are `kebab-case`, plural resource: `material-requests`, `projects`.
- Boolean variables read as yes/no questions: `isLoading`, `hasSubmitted`, `canApprove`, `isAssigned` — not `loading`, `submitted`, `approve`.
- Server actions are named for what they do: `submitReport`, `approveMaterialRequest`, `assignSupervisor`, `updateIssueStatus`. Not `handleData` or `doAction`.

## Domain Constants

Define these once in `src/lib/constants.ts` and import them everywhere. Never hardcode these values inline — they appear across validation, UI, and error messages, and a single source of truth prevents drift.

```ts
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
export const FILES_PER_ENTITY = 1;       // one image per report, one per issue
export const PROGRESS_MIN = 0;
export const PROGRESS_MAX = 100;
export const MIN_TAP_TARGET_PX = 44;
export const PROJECT_STATUSES = ['active', 'delayed', 'on_hold', 'completed'] as const;
export const ISSUE_STATUSES = ['open', 'in_progress', 'resolved'] as const;
export const PRIORITIES = ['low', 'medium', 'high', 'critical'] as const;
export const REQUEST_STATUSES = ['pending', 'approved', 'rejected', 'fulfilled'] as const;
```

## File Organization

One component per file. The file name matches the component name. If a helper is used only inside one component, define it in the same file below the component. If it is used elsewhere, lift it to `src/lib/`.

Order inside a component file:
1. Imports (React first, third-party next, local `@/` imports last, a blank line between groups)
2. Types and interfaces
3. Constants
4. The component
5. Helper functions used only by this component

Keep files focused. If a component file passes roughly 200 lines, look for pieces to extract.

## TypeScript

Prefer `type` over `interface` unless you need declaration merging. Keep types close to where they are used; put shared types in `src/types/index.ts`. Derive types from the Prisma client where possible rather than re-declaring model shapes by hand — if the schema changes, the types should follow automatically.

## React and Next.js

Write function components with hooks. Destructure props in the signature.

Server components are the default. Add `"use client"` only when the component needs state, effects, browser APIs, or event handlers — the report form, issue form, material request form, project creation form, filter bars, and the notification bell dropdown. If a component is marked `"use client"` but has no `useState`, `useEffect`, `onClick`, or browser-only code, it should not be a client component.

Keep the client boundary as low in the tree as possible. A list page that is mostly static but has a filter bar stays a server component; only the filter bar is a client component.

Never call the database from a client component. Reads happen in server components; writes happen through server actions. See `architecture.md`.

Every data-driven view handles three states explicitly: loading, empty, and error. Use the shared state components in `src/components/states/` and the exact copy in `design-system.md`. Do not invent new wording or skip a state.

## Server Actions

Server actions live in an `actions.ts` file next to the page that uses them, with `"use server"` at the top. They follow a fixed order: validate input with zod, check permissions, write through Prisma, fire any notification, revalidate the affected cache, return the structured result. See `api-route-scaffold/skills.md` for the template. Keep the body small; if the core logic grows past a few lines, extract it into `src/lib/`.

## Styling

CSS Modules only. Every component that needs styling has a sibling `ComponentName.module.css`. No inline `style={{}}` except for a genuinely dynamic value that cannot be expressed in CSS — the clearest example is a progress bar width driven by `progress_percentage`. No Tailwind. No styled-components. No CSS-in-JS.

Every color, font size, font weight, font family, line height, and letter spacing comes from a CSS variable defined in `tokens/design-tokens.css`. Never write a raw hex value, a raw pixel font size, or a font-family string. If you need a value that does not exist as a token, stop and ask the developer rather than inventing one. See `design-system.md` for the available tokens and the spacing and radius scales.

## Comments

Comment the *why*, not the *what*. The code already says what it does.

Good: `// Drafts live in localStorage only; nothing is written to the DB until submit.`
Bad: `// Set the loading state to true.`

Flag any deliberate simplification with a short note so a future reader does not "fix" it into something out of scope, e.g. `// One image per entity by design — do not loop for multiple files.`

Do not leave commented-out code in committed files.

## Error Handling

Wrap database calls, file operations, and anything that can throw in try/catch. Log the real error on the server with enough context to debug. Return the structured failure shape from `architecture.md` (`{ ok: false, error: { code, message } }`) and map it to the user-facing copy in `design-system.md`. Never return a raw exception, stack trace, or Prisma error to the client. Never use a bare `catch (e) {}` with no log and no handling.

## Async

Prefer `async`/`await` over `.then()` chains. Do not fire a promise without awaiting it unless you mean to run something in the background — and if you do, add a comment saying so.

## Imports

Use the `@/` alias for local imports: `import { Button } from '@/components/ui/Button'`, not `'../../../components/ui/Button'`.

Dependencies flow one way: `lib` is the foundation, `components` sits on top of `lib`, `app` sits on top of both. Do not import from `app/` into `components/` or `lib/`.

## Formatting

Prettier handles all formatting. Do not hand-format code or argue with the formatter. The config lives at the project root. Settings:

- 2-space indentation
- Single quotes for strings (except to avoid escaping)
- Semicolons required
- Trailing commas where valid (multi-line objects, arrays, params)
- Imports grouped and ordered: React first, third-party next, local `@/` imports last, a blank line between groups

Run Prettier before considering any work done. No unused imports or variables in committed code.

## What Not to Do

- Do not hardcode the file size limit, progress bounds, tap target size, or any enum values — import them from `src/lib/constants.ts`.
- Do not hardcode colors, font sizes, or font families — use the CSS variables from `tokens/design-tokens.css`.
- Do not use Tailwind, inline styles (except dynamic values like progress width), or any CSS-in-JS.
- Do not put business logic or database calls in client components.
- Do not skip the loading, empty, or error states — they are part of "done".
- Do not add a state-management library, a data-fetching library, a date library, or a UI component kit. The app does not need them.
- Do not leave `console.log` in committed code.
- Do not add a dependency without discussing it with the developer first. Every dependency is a long-term cost.
- Do not disable TypeScript strictness to make an error go away.