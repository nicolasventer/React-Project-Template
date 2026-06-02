# Translation dictionary conventions

Strings live in [`lang/en.ts`](lang/en.ts) (reference shape) and [`lang/fr.ts`](lang/fr.ts) (and any other locale files). Other languages must satisfy `export type Tr = typeof en` from `en.ts`.

---

## Top-level sections (order)

Sections are grouped by **feature or surface**, not by a single global alphabetical list. Use this order when adding new areas so the file stays predictable:

1. **`notFound`** — Standalone routes such as the 404 page (copy that only applies there).
2. **`theme`** — Theme toggle: labels for the current mode and actions to switch it.
3. **`lang`** — Language switcher: actions to pick another locale and loading state.
4. **`home`** — The home (`/`) page.
5. **`todo`** — The todo feature / `/todo` experience.

When you add a new feature (e.g. `settings`), append a new top-level key in a sensible place—usually after related routes or in **alphabetical order among feature keys** if there is no clear dependency.

---

## Subgroups (inside a feature)

Use the same subgroup names across features when the meaning fits:

| Subgroup      | Use for                                                                                                                                |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **`heading`** | Page or screen title, subtitle, section headings shown as primary copy.                                                                |
| **`form`**    | Placeholders and labels tied to inputs (text fields, search, etc.).                                                                    |
| **`action`**  | Buttons, links, and commands: verbs or short CTA phrases (`add`, `goToHomePage`, `cancel`).                                            |
| **`aria`**    | Strings built for accessibility (often with placeholders like `{title}`). Prefer this over stuffing long aria text under `action`.     |
| **`status`**  | Loading text, errors, counts, empty states, and other **feedback** that is not a direct user command.                                  |
| **`label`**   | Short names for discrete choices or modes (tabs, pills, theme names), especially when paired with `action` for switching.              |

Not every feature needs every subgroup—only add the ones you use.

---

## Keys and placeholders

- Use **camelCase** for all object keys.
- Within each object, keep sibling keys in **alphabetical order** when it does not hurt readability.
- Use **`{placeholder}`** in strings where the app substitutes values, for example `{n}` for a number and `{title}` for a task title. Keep placeholder names consistent across languages.

---

## Adding or changing copy

1. Add or change the key in **`en.ts`** first (that file defines `Tr`).
2. Mirror the same nested structure in **every other** language file (e.g. `fr.ts`).
3. Update components to use the new path (e.g. `tr.todo.action.add`).
4. **Do not keep unused keys**—if nothing references a string, remove it from all locale files.

---

## Runtime loading

Lazy loading and the `Lang` type are wired in [`index.ts`](index.ts). The active bundle is stored in app state and exposed as `tr` (see `logic/tr.ts` and `AppLifeCycle.tsx`).
