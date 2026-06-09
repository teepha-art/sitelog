---
trigger: always_on
---

# Design System Rules

SiteLog is an operational tool for construction teams, not a consumer app. It must feel fast, structured, and trustworthy. A PM scans it every morning; a supervisor uses it on a phone in the field, in sunlight, on a slow connection. Clarity and speed before decoration. Read this before building any screen — UI that ignores it gets rebuilt.

Detailed page-by-page layouts and the exact state copy live in `docs/prd.md` (Section 16: UI Layout Reference, Section 17: Exact State Copy). This file is the binding rules; the PRD is the detailed visual structure. Use both.

## The Token File Is the Source of Truth

Every color and typography value comes from `tokens/design-tokens.css`. Before writing any style, open that file and use its CSS variables. Never write a raw hex color, a raw pixel font size, or a font-family string. Never invent a token — if you need a value that does not exist, stop and ask the developer.

Styling is **CSS Modules only** — each component has a sibling `ComponentName.module.css`. Never use Tailwind, styled-components, CSS-in-JS, or inline styles (the one exception is a genuinely dynamic value like a progress bar width).

- ✅ Correct: `color: var(--color-on-surface);` · `font-size: var(--font-body-medium-font-size);`
- ❌ Wrong: `color: #1a1a1a;` · `font-size: 14px;` · `font-family: 'Inter';`

**Light mode only.** The token file contains a `[data-theme="dark"]` block. Ignore it. Never set `data-theme="dark"`. Do not build a theme toggle. That block references palette steps that do not exist and must never be activated.

## Color Roles

Use only the semantic color roles. Never reference a palette primitive (`--color-palette-*`) or a key/source hue (`--color-key-*`) directly in component CSS.

Most-used roles: `--color-primary` (primary actions, active nav, key buttons, links), `--color-on-primary` (text on primary), `--color-primary-container`; `--color-background` / `--color-on-background` (page bg + text); `--color-surface` / `--color-on-surface` (cards + text); `--color-surface-variant` / `--color-on-surface-variant` (muted panels + secondary text); `--color-surface-container` (sidebar, raised containers) with `-low` / `-high` / `-highest` for elevation; `--color-outline` (borders, dividers, inputs) and `--color-outline-variant` (lighter); `--color-error` / `--color-on-error` / `--color-error-container`.

**Status and priority colors.** The token file exposes semantic roles `--color-success`, `--color-on-success`, `--color-success-container`, `--color-warning`, `--color-on-warning`, `--color-warning-container` (mirroring `--color-error`). Map them: resolved / approved → success; delayed / pending → warning; rejected / critical / error → error; open / neutral → `--color-on-surface-variant`. **Never communicate status or priority by color alone** — always pair the color with a text label (a "Resolved" chip reads "Resolved", it is not just green).

## Typography

Two families, both in the token file:
- **Space Grotesk** — all headings: the `display`, `headline`, `title` token families (page titles, section headings, card titles, KPI numbers). The logo is an SVG, not typeset in code — see Logo below.
- **Inter** — all body/supporting text: the `body` and `label` families (paragraphs, tables, form fields, captions, buttons).

Always apply a full typography token (it bundles family, size, weight, line-height, letter-spacing), not individual properties. Use: `--font-display-*` for the landing hero only; `--font-headline-*` for in-app page titles; `--font-title-*` for section/card titles; `--font-body-medium` for body; `--font-body-small` for captions/timestamps; `--font-label-*` for buttons, form labels, chips. Do not use a size outside these tokens.

## Logo & Brand Assets

The logo is never drawn in code or recreated. SVG files live in `public/logo/` (if placed in a root `logo/` folder before scaffolding, move them into `public/logo/` during setup). Reference them — never redraw, recolor, restretch, or approximate.

- `public/logo/sitelog_wordmark_color.svg` — two-tone wordmark (blue "Site", slate "Log"). The default logo: landing header, sidebar, light footer.
- `public/logo/sitelog_wordmark_white.svg` — all-white wordmark. Only on dark backgrounds (rare; the app is light mode).
- `public/logo/sitelog_favicon.svg` — the "S" mark (white S on filled blue rounded square). Favicon and tight spaces.

SVGs scale losslessly — size with CSS (e.g. ~32px tall in the sidebar), never multiple files per size. Generate the favicon files (`favicon.ico`, `apple-touch-icon.png`) from `sitelog_favicon.svg` and place where Next.js expects.

## Spacing Scale

Use multiples of 4px for all spacing (margin, padding, gap). Allowed: `4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`. No arbitrary values. Be generous with whitespace, especially on mobile — a cramped interface feels cheap and is hard to use in the field.

## Border Radius

Use only: badges / tags / chips `4px`; buttons / inputs `8px`; cards / modals `12px`.

## Layout & Structure

A polished UI comes from a correct layout shell, not just nice colors. Build the shell first; never drop content onto a blank page. The full per-page layouts (app shell, landing page, pricing, auth page, dashboard, list/detail/project-detail/form layouts) are specified in `docs/prd.md` Section 16. The binding rules:

- **Every authenticated page uses the persistent app shell** — a fixed ~240px sidebar (`--color-surface-container`, logo on top, nav below, active item in `--color-primary`) plus a top bar (page title + notification bell + user menu), with content in a max-width container (24px padding desktop, 16px mobile). On mobile the sidebar collapses to a bottom nav. Navigating swaps only the content area — the shell stays mounted, never reloads.
- **Build the landing page at `/`.** The app does not start at the dashboard. Flow: landing → auth → role home.
- **One auth page** holds login, sign-up, and reset forms rendered conditionally and swapped in place — not separate pages.
- **Dashboard:** 5 KPI cards in a row (Active Projects, Delayed Projects, Open Issues, Pending Requests, Reports Today), each tappable to a filtered list, then a Recent Activity list below.
- **Project detail page:** a project header plus four tabs (Reports, Issues, Material Requests, Recent Activity).
- **Forms:** single column, labels above inputs (never placeholder-as-label), 44px min input height, validate on submit.

## Core Components

Build as reusable primitives in `src/components/ui/` and `src/components/states/`. Compose, do not duplicate.

- **Button** — variants primary / secondary / ghost / destructive; sizes sm/md/lg (default md); min height 44px; `loading` prop shows a spinner and disables.
- **Card** — `--color-surface`, `12px` radius, subtle `--color-outline` border, no heavy shadow.
- **KpiCard** — label + large number; tappable, navigates to a filtered list.
- **StatusChip** — small `4px`-radius chip; always a text label plus its status/priority color, never color alone.
- **Input / Select / TextArea** — label above, error slot below, 44px min height, `8px` radius, `--color-primary` focus ring.
- **FileUpload** — single image (one per report, one per issue); validates type and 5MB; preview + replace. Phase 2.
- **FilterBar** — client component; holds a feature's filters; writes filter state to URL search params.
- **NotificationBell** — client component; bell + count badge in the top bar; dropdown of recent notifications; count clears on open.
- **EmptyState / LoadingState / ErrorState** — shared state components used on every data view; accept copy as props.

## The Three States — Required on Every Data View

Every screen that loads data implements all three; this is part of "done". Use the shared state components and the **exact copy in `docs/prd.md` Section 17** — do not invent wording or skip a state.

- **Loading** — skeleton loaders for cards/rows; a spinner on a submitting button (and disable the form). Navigation stays active.
- **Empty** — a clear message and, where relevant, the next action. Never a bare "No data".
- **Error** — a non-technical, recovery-focused message. Preserve any user input.

## Mobile Requirements

Supervisor workflows are the primary mobile use case. If mobile fails, the product fails.
- Mobile-first: default styles target small screens, then layer desktop with `@media (min-width: 768px)`.
- Every interactive element at least 44x44px. Minimum contrast 4.5:1 for outdoor readability.
- Prefer dropdowns, selects, toggles over free text where possible.
- Never disable pinch-to-zoom. Every async action shows a loading indicator.
- The daily report form must be fully usable on a 375px-wide viewport.

## Common Mistakes

- Dropping content onto a blank page with no app shell. Every authenticated page uses the persistent sidebar + top bar shell.
- Starting at the dashboard and skipping the landing page. Build the landing page.
- Separate pages for login and sign-up. One auth page, conditional forms.
- A raw hex or pixel font size instead of a token; a `--color-palette-*` primitive instead of a semantic role.
- Communicating status or priority with color only, no text label.
- Activating `data-theme="dark"`. Light mode only.
- Arbitrary spacing instead of the 4px scale.
- Skipping the loading, empty, or error state on a data view.
- Making a whole page a client component when only one part (a form or filter) needs interactivity.