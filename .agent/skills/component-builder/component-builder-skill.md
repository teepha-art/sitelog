# Component Builder Skill

Load this skill whenever you are creating or modifying a React component in SiteLog. It tells you where the component goes, how to structure it, and how to wire it to the design system without reinventing anything.

## Before You Start

Read `.agent/rules/design-system.md` first. Components that do not follow the design system get rebuilt. This skill assumes you already know the tokens, the spacing scale, the radius values, and the layout rules in that file.

Then ask: does this component already exist? Search `src/components/` before adding a new one. Two slightly different Button components is how a codebase rots. If something close exists, extend it with a new variant instead of duplicating it.

## Where Components Live

```
src/components/
├── ui/          primitives: Button, Card, Input, Select, TextArea, StatusChip, Badge
├── states/      EmptyState, LoadingState, ErrorState
└── features/    domain components: KpiCard, ReportForm, IssueTable, FilterBar, NotificationBell, ProjectHeader
```

If a component is used in exactly one place and is complex, it can live next to the page that uses it in an `_components/` folder. Promote it to `src/components/` when a second caller appears. Do not abstract prematurely.

## Styling: CSS Modules + Tokens Only

Every component that needs styling has a sibling CSS Module: `KpiCard.tsx` and `KpiCard.module.css`. No Tailwind. No inline styles except a genuinely dynamic value that cannot be expressed in CSS (the clearest case is a progress bar width driven by `progress_percentage`). No CSS-in-JS.

Every value comes from a token in `tokens/design-tokens.css`. Never write a raw hex, a raw pixel font size, or a font-family. Use the semantic color roles (`--color-primary`, `--color-surface`, `--color-on-surface`, `--color-outline`, `--color-error`, `--color-success`, `--color-warning`, etc.) — never the `--color-palette-*` primitives or `--color-key-*` source hues. Apply full typography tokens, not individual font properties.

```css
/* KpiCard.module.css */
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-outline);
  border-radius: 12px;
  padding: 16px;
}
.label {
  font-family: var(--font-label-medium-i-font-family);
  font-size: var(--font-label-medium-i-font-size);
  color: var(--color-on-surface-variant);
}
.value {
  font-family: var(--font-headline-medium-font-family);
  font-size: var(--font-headline-medium-font-size);
  color: var(--color-on-surface);
}
```

If you need a value that has no token, stop and ask the developer. Do not invent one.

## Component File Template

```tsx
// src/components/ui/ComponentName.tsx
import styles from './ComponentName.module.css';

type ComponentNameProps = {
  // Required props first, optional after.
  children?: React.ReactNode;
  className?: string;
};

export function ComponentName({ children, className }: ComponentNameProps) {
  return (
    <div className={`${styles.root} ${className ?? ''}`}>
      {children}
    </div>
  );
}
```

- Named export, not default. Default exports make renaming harder and break auto-imports.
- Props type above the component, named `ComponentNameProps`, required props before optional.
- Accept `className` on components that render a single root element so callers can extend layout without forking the component.

## Server vs Client Components

Default to a server component. A component becomes a client component (`"use client"` on the first line) only when it needs one of:
- React state (`useState`, `useReducer`)
- Effects (`useEffect`)
- Browser APIs (`window`, `document`, `localStorage`)
- Event handlers beyond a plain link (`onClick`, `onChange`, `onSubmit`)

In SiteLog the client components are: the report form, issue form, material request form, project creation form, the filter bars, the notification bell dropdown, and the two pricing toggles. Almost everything else — lists, detail views, cards, the dashboard, tables — is a server component that receives data as props.

Keep the client boundary low. A list page stays a server component; only its filter bar is a client component. Never put a database call in a client component — reads happen in server components, writes go through server actions (see `api-route-scaffold/skills.md`).

## Variants

For components with variants (Button, StatusChip), use a small typed map keyed off a prop, not a chain of conditionals. Map the variant to a CSS Module class:

```tsx
import styles from './Button.module.css';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
};

const variantClass = {
  primary: styles.primary,
  secondary: styles.secondary,
  ghost: styles.ghost,
  destructive: styles.destructive,
};
const sizeClass = { sm: styles.sm, md: styles.md, lg: styles.lg };

export function Button({ variant = 'primary', size = 'md', loading, disabled, children, ...props }: ButtonProps) {
  return (
    <button
      className={`${styles.base} ${variantClass[variant]} ${sizeClass[size]}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <span className={styles.spinner} aria-hidden /> : null}
      {children}
    </button>
  );
}
```

## The Three State Components

`EmptyState`, `LoadingState`, and `ErrorState` live in `src/components/states/` and are used on every data view. They accept their copy as props so each screen passes the exact wording from `design-system.md`. Build them once; never reimplement an empty or error block inline.

- **LoadingState**: skeleton rows/cards, or a spinner for a submitting form. Never a blank screen.
- **EmptyState**: an icon, a message, and an optional action button (e.g. the dashboard's "Create Your First Project").
- **ErrorState**: a non-technical message and, where useful, a retry. Never a raw error.

Every list, detail view, dashboard, and form handles all three states. This is part of "done", not an extra.

## SiteLog Component Recipes

Build these as the shared set. Compose pages from them.

| Component | Notes |
|---|---|
| `Button` | Variants primary / secondary / ghost / destructive; sizes sm/md/lg; `loading` prop; min height 44px. |
| `Card` | `--color-surface`, `12px` radius, `--color-outline` border, no heavy shadow. |
| `Input` / `Select` / `TextArea` | Label above (never placeholder-as-label), error slot below in `--color-error`, 44px min height, `8px` radius, `--color-primary` focus ring. |
| `StatusChip` | Small chip, `4px` radius, **always a text label plus color** — never color alone. Maps status/priority to a role: resolved/approved → `--color-success`; delayed/pending → `--color-warning`; rejected/critical/error → `--color-error`; open/neutral → `--color-on-surface-variant`. |
| `KpiCard` | Label + large number (Space Grotesk headline token). Tappable, navigates to a filtered list. Five of these across the dashboard top. |
| `FilterBar` | Client component. Holds a feature's filters; writes filter state to URL search params so the server component can read and query. |
| `FileUpload` | Single image (one per report, one per issue). Validates type and 5MB. Shows a preview, allows replacing. Phase 2. |
| `NotificationBell` | Client component. Bell + count badge in the top bar; opens a dropdown of recent notifications; count clears on open. |
| `ReportForm` / `IssueForm` / `MaterialRequestForm` / `ProjectForm` | Client components. Single column, labels above inputs, validate on submit, call a server action. The report form preserves input to localStorage as the user types and clears it on success. |
| `ProjectHeader` | The project detail header card (name, code, status chip, location, dates, team size). |

## Accessibility

- Every interactive element has a visible keyboard focus state using `--color-primary`.
- Icon-only buttons (the notification bell, a close "X") need an `aria-label`.
- Form inputs have a real `<label>` tied to the input via `htmlFor`/`id`; errors link via `aria-describedby`.
- Images have `alt` text; decorative images use `alt=""`.
- Status is never communicated by color alone — the text label in the chip carries the meaning.
- Tap targets are at least 44x44px.

## Props to Avoid

- Do not expose raw color props (`color="blue"`). Use variants that map to roles.
- Do not expose raw pixel sizes. Use the size variants and the spacing scale.
- Do not accept a `style` prop for static styling. The only inline style allowed is a dynamic value like progress width.

## Common Mistakes

- Creating a new primitive when an existing one would work with a new variant. Extend, do not duplicate.
- Making a whole page a client component because one part needs interactivity. Push `"use client"` down to that part.
- Putting a database call or business logic in a client component.
- Hardcoding a color or font size instead of using a token, or reaching for a `--color-palette-*` primitive instead of a semantic role.
- Communicating status or priority with color only, no text label.
- Skipping the loading, empty, or error state on a data view.
- Forgetting the `className` passthrough on a component that needs to be laid out differently in different places.
- Disabling pinch-to-zoom or using tap targets under 44px.
- Building an inline empty/error block instead of using the shared state components.