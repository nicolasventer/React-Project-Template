# Translation dictionary conventions

Each UI surface owns its own `dict/` folder with lazy-loaded language files. Strings are never shared across surfaces — shell copy lives here under `src/app/dict/`, and feature copy lives under `src/features/<name>/dict/`.

English (`lang/en.ts`) is the reference shape. Every other locale must satisfy `export type Tr = typeof en` (or `export const fr: Tr = { … }`).

---

## One dict per surface

| Surface   | Dict path                   | `tr` store                        | Loaded by                |
| --------- | --------------------------- | --------------------------------- | ------------------------ |
| App shell | `src/app/dict/`             | `src/app/logic/tr.ts`             | `AppLifeCycle.tsx`       |
| Feature   | `src/features/<name>/dict/` | `src/features/<name>/logic/tr.ts` | `<Feature>LifeCycle.tsx` |

A component reads strings from the `tr` store of **its own surface only**. The shell never imports feature dicts, and features never import the shell dict.

---

## Object shape

Every lang file exports a single object (`en`, `fr`, …) with **two levels**:

1. **Top-level key** — the surface or feature name (`home`, `theme`, `counter`, …).
2. **Leaf keys** — flat **camelCase** string entries (or functions — see below). No further nesting.

### App shell (`src/app/dict/lang/en.ts`)

Top-level keys map to shell UI areas. Add one key per area:

```ts
export const en = {
	notFound: { goToHomePage: "…", notFoundPath: (path) => `…`, title: "…" },
	theme: { dark: "…", light: "…", switchToDark: "…", switchToLight: "…" },
	lang: { loading: "…", switchToEnglish: "…", switchToFrench: "…" },
	home: { subtitle: "…", title: "…" },
};
```

Current shell areas and their role:

| Key        | Used for                             |
| ---------- | ------------------------------------ |
| `notFound` | 404 page                             |
| `theme`    | Dark/light toggle (`DarkModeButton`) |
| `lang`     | Language switcher (`LangButton`)     |
| `home`     | Home page (`/`)                      |

When adding a new shell page or control, add a new top-level key named after that area.

### Feature (`src/features/<name>/dict/lang/en.ts`)

A feature dict has **one top-level key** named after the feature:

```ts
export const en = {
	counter: { decrement: "…", increment: "…", label: "…" },
};

export type Tr = typeof en;
```

```ts
export const en = {
	timer: { label: "…", unit: "…" },
};
```

Components access strings as `tr.<feature>.<key>` (e.g. `tr.counter.increment`, `tr.timer.unit`).

---

## Leaf key rules

- **camelCase** for every leaf key.
- Keep sibling keys in **alphabetical order** within each top-level object.
- **Plain strings** for static copy.
- **Functions** when the string depends on runtime values. Parameters are typed; keep names consistent across languages:

```ts
notFoundPath: (path: string) => `The path "${path}" was not found`,
```

- **`{placeholder}`** syntax inside template literals when substituting values in function bodies.
- **Remove unused keys** from every language file when copy is deleted from the UI.

---

## File layout

```
dict/
├── index.ts          # lazy loaders per Lang
└── lang/
    ├── en.ts         # reference shape + export type Tr
    └── fr.ts         # export const fr: Tr = { … }
```

`index.ts` registers one async loader per language:

```ts
export const dict = {
	en: () => Promise.resolve(en),
	fr: () => import("./lang/fr").then((m) => m.fr),
} as const satisfies Record<Lang, () => Promise<Tr>>;
```

English is bundled eagerly; other languages are code-split.

---

## Adding or changing copy

### New string in an existing area

1. Add the leaf key in `lang/en.ts` (alphabetically among siblings).
2. Mirror it in every other `lang/*.ts` file for that surface.
3. Read it from the surface's `tr` store in components (`trV.home.title`, `trV.counter.increment`, …).

### New shell area

1. Add a top-level key in `src/app/dict/lang/en.ts` and mirror it in other langs.
2. Use it from shell components via `app/logic/tr`.

### New feature strings

1. Add leaf keys under the feature's top-level key in `src/features/<name>/dict/lang/en.ts`.
2. Mirror in that feature's other lang files.
3. Use from feature components via `features/<name>/logic/tr`.

### New language

1. Add the code to `Lang` in `src/shared/types/Lang.ts`.
2. Create `lang/<code>.ts` in **each** dict that should support it (shell + relevant features).
3. Implement the full `Tr` shape from that surface's `en.ts`.
4. Register the loader in each `dict/index.ts`.

---

## Runtime loading

When `lang.data` changes (`src/shared/logic/lang.ts`), the matching `*LifeCycle` component loads the active chunk and writes it into that surface's `tr` store:

- Shell: `dict[langV]()` → `tr.data.setValue` in `AppLifeCycle.tsx`
- Feature: `dict[langV]()` → `tr.data.setValue` in e.g. `CounterLifeCycle.tsx`

Until the chunk resolves, components keep showing the previous bundle (English is available immediately).
