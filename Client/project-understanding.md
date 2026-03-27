# Project Understanding

## Overview

This document summarizes how this **React + TypeScript + Vite** template is organized: folders, routing, global state, persistence, i18n, and the ESLint rules that keep modules decoupled.

The app exposes a single façade object **`app`** from `src/logic/index.ts`. Pages and components import `@/logic` and use `app.route`, `app.todos`, `app.tr`, and so on. Each file under `src/logic/` (except `index.ts`) is **independent** and must not import sibling logic modules.

_[back to top](#project-understanding)_

## Code organization

### Client structure (`src/`)

```
src/
├── index.tsx              # React entry: createRoot, StrictMode
├── localStorage.ts        # Serialize/deserialize one app-wide snapshot to `localStorage`; sync from lifecycle
├── globalRef.ts           # Mutable object for session-only, non-Store values shared across logic modules
├── api/                   # Eden Treaty client, mock, generated types, api.config
├── assets/                # Static assets (images, fonts, …) per folderStructure rules
├── components/            # React UI
│   └── app/
│     └── AppLifeCycle.tsx # Effects on state changes (i18n load, persistence, theme/CSS vars)
├── config/                # cliConfig (defaults/types), srvConfig (API base URL)
├── dict/                  # i18n: index + lazy lang/*.ts chunks
├── logic/                 # Domain modules (independent) + index.ts → `app` facade
│   └── index.ts           # Builds the `app` object facade
├── pages/                 # Slot for manual routing
│   └── App.tsx            # App shell (providers + routing via SwitchV) + mounts AppLifeCycle
├── routes/                # Slot for [Easy React Router](https://github.com/nicolasventer/Easy-React-Router) file-based routes
├── types/                 # Shared *.type.ts
└── utils/                 # Store, hooks, MultiIf / SwitchV, helpers
    └── hooks/             # Shared React hooks (mount, interval, loading, etc.)
```

Enforced layout: `folderStructure.mjs`. Import boundaries: `independentModules.mjs`.

_[back to top](#project-understanding)_

## Tech stack

| Area                | Technology                                                                                                                                                      |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Language**        | TypeScript                                                                                                                                                      |
| **UI**              | React 19                                                                                                                                                        |
| **Bundler / dev**   | Vite 8                                                                                                                                                          |
| **State**           | Custom `Store` (`src/utils/Store.ts`) + domain modules in `src/logic/`                                                                                          |
| **Routing**         | Custom: `src/logic/route.ts` + `SwitchV` in `pages/App.tsx`; `src/routes/` prepared for [Easy React Router](https://github.com/nicolasventer/Easy-React-Router) |
| **HTTP (optional)** | `@elysiajs/eden` Treaty client (`src/api/api.ts`), types in `api.gen.ts`                                                                                        |
| **i18n**            | Lazy-loaded `dict/lang/*`, strings in `app.tr`                                                                                                                  |
| **Persistence**     | Single `localStorage` JSON blob (`src/localStorage.ts`)                                                                                                         |
| **Quality**         | ESLint (React, TypeScript, folder structure, independent modules)                                                                                               |

_[back to top](#project-understanding)_

## Entry, shell, and lifecycle

### `src/index.tsx` (entry)

Third-party setup that should run once at startup — e.g. default locale for `dayjs`, side-effect imports for a design system, or other library initialization.

### `src/pages/App.tsx` (application shell)

- **Providers** — wrap the tree with context-based APIs (e.g. theme, query client, toast hosts).
- **Routing** — map the current route to pages (`SwitchV` + `app.route` here; you can swap in another router while keeping this shell role).
- **Lifecycle** — render **`AppLifeCycle`** once near the root so global effects run for the whole session.
- **Global UI** — app-wide modals, command palettes, or portals not tied to a single page.

### `src/components/app/AppLifeCycle.tsx` (effects on state changes)

Headless component (returns `null`) that centralizes `useEffect` and store-driven effects when domain state changes:

- **Persistence** — sync in-memory state to `localStorage` via `app.localStorage.update`.
- **i18n** — when language changes, load the matching dict chunk and update `app.tr`.
- **Document / DOM** — e.g. `data-theme` on `document.documentElement`, or CSS variables when config changes.

_[back to top](#project-understanding)_

## State, `Store`, and logic boundaries

- **`Store`** (`src/utils/Store.ts`): `setValue`, `use()`, `useState()`, `useEffect` on the store; optional updates wrapped in **`document.startViewTransition`**.
- **`Store.value`**: use **only inside the same `src/logic/*.ts` file** that owns that store. Elsewhere, read with **`.use()`** / **`.useState()`**.
- **Cross-domain data**: logic functions take external values as **parameters**; the **component** (or `AppLifeCycle`) subscribes with **`.use()`** and passes arguments into actions — logic files do not import sibling `logic/*` modules.
- **`src/logic/index.ts`** is the only logic file that may import all domain modules and build **`app`**.

_[back to top](#project-understanding)_

## Entity definitions (template domain)

### `Todo`

```typescript
type Todo = {
	id: string;
	title: string;
	done: boolean;
};
```

`DoneFilter` is `"all" | "active" | "completed"` (`src/types/Todo.type.ts`).

### `Route`

Parsed from `window.location` in `src/logic/route.ts`:

```typescript
type Route = { url: "/" } | { url: "/todo" } | { url: "/todo?:id"; id: string } | { url: "/404" };
```

### Persisted snapshot (`localStorage`)

`src/localStorage.ts` — types, defaults, and helpers for the persisted snapshot with **JSON.stringify**; `AppLifeCycle` keeps it aligned with live state. See `LocalStorageState` and `initialLocalStorageState`.

### Session refs (`globalRef`)

`src/globalRef.ts` exports a plain mutable object for data that should **not** use `Store` (no subscriptions, no persistence) but still needs to be shared between logic modules — for example history, library references, states needed for only update, not render.

### `Lang` and translations

`Lang` is keyed off `src/dict/index.ts`. Runtime strings live in `app.tr` (`src/logic/tr.ts`) after `AppLifeCycle` loads the chunk for the active language.

### `Config` (todo UI tuning)

Defined by `DEFAULT_CONFIG` in `src/config/cliConfig.ts`, held in `app.config` (`src/logic/config.ts`).

_[back to top](#project-understanding)_

## Features (what this template demonstrates)

- **Home** — landing copy, language toggle, dark/light control, navigation to the todo screen.
- **Todo app** — add/remove/toggle/edit todos, filter (all/active/completed), search, clear completed; styling knobs via `config`.
- **Internationalization** — English/French (extend under `src/dict/lang/`).
- **Theme** — `data-theme` on the document root for CSS.
- **Persistence** — todos, language, theme, and config survive reloads via `localStorage`.
- **Optional API** — mock or Treaty client; toggle in `src/api/api.config.ts`; base URL in `src/config/srvConfig.ts`.

_[back to top](#project-understanding)_

## Related docs

- **`How-to.md`** — how to add a route, logic, data to localStorage, config, translation (lang or word).
- **[Easy React Router](https://github.com/nicolasventer/Easy-React-Router)** — file-based `src/routes/`, Vite plugin, and static route generation.
