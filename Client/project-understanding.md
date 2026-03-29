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
├── pages/                 # Slot for manual routing (with BasicRouter)
│   └── App.tsx            # App shell (providers + SwitchV on `app.route.state.route`) + mounts AppLifeCycle
├── routes/                # Slot for file-based routing with [Easy React Router](https://github.com/nicolasventer/Easy-React-Router)
├── types/                 # Shared *.type.ts
└── utils/                 # Store, hooks, MultiIf / SwitchV, BasicRouter, helpers
    └── hooks/             # Shared React hooks (mount, interval, loading, etc.)
```

Enforced layout: `folderStructure.mjs`. Import boundaries: `independentModules.mjs`.

_[back to top](#project-understanding)_

## Routing

- **Routes** — Register path strings on **`BasicRouter`** in **`src/logic/route.ts`**, following **[Easy React Router conventions](https://github.com/nicolasventer/Easy-React-Router#file-based-routing)** (e.g. `/:key` for required segments, `?key` for optional params).
- **Base** — **`setRouterBaseRoute(BASE_URL)`** strips the deployment base from the pathname so matching uses the app-relative path.
- **Navigation** — **`navigateToRouteFn(path, params?)`** — go to a declared route (pass **params** when the pattern includes `:…` or `?…`). **`buildRouteLink(path, params?)`** — build an `href`. **`navigateToCustomRouteFn(url)`** — arbitrary URL (avoid unless necessary).
- **UI** — **`app.route.state.route.use()`** for **`{ path, params }`**, then **`SwitchV`** to pick the page. **Note:** **`SwitchV`**’s **`value`** must be the **full route object**, with **`transform`** narrowing to **`path`** for the cases; if **`value`** were only **`path`**, the same path with different **params** might not re-run the branch.

_[back to top](#project-understanding)_

## Tech stack

| Area                | Technology                                                                                                                                                 |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Language**        | TypeScript                                                                                                                                                 |
| **UI**              | React 19                                                                                                                                                   |
| **Bundler / dev**   | Vite 8                                                                                                                                                     |
| **State**           | Custom `Store` (`src/utils/Store.ts`) + domain modules in `src/logic/`                                                                                     |
| **Routing**         | **BasicRouter** (`src/utils/BasicRouter.ts`) + `src/logic/route.ts` + `SwitchV` in `pages/App.tsx`;                                                        |
|                     | `src/routes/` prepared for [Easy React Router](https://github.com/nicolasventer/Easy-React-Router) (same conventions / API shape for an easier transition) |
| **HTTP (optional)** | `@elysiajs/eden` Treaty client (`src/api/api.ts`), types in `api.gen.ts`                                                                                   |
| **i18n**            | Lazy-loaded `dict/lang/*`, strings in `app.tr`                                                                                                             |
| **Persistence**     | Single `localStorage` JSON blob (`src/localStorage.ts`)                                                                                                    |
| **Quality**         | ESLint (React, TypeScript, folder structure, independent modules)                                                                                          |

_[back to top](#project-understanding)_

## Entry, shell, and lifecycle

### `src/index.tsx` (entry)

Third-party setup that should run once at startup — e.g. default locale for `dayjs`, side-effect imports for a design system, or other library initialization.

### `src/pages/App.tsx` (application shell)

- **Providers** — wrap the tree with context-based APIs (e.g. theme, query client, toast hosts).
- **Routing** — map **`app.route`** to page components with **`SwitchV`** (see [Routing](#routing)).
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

## Entity definitions

### `Todo` (example)

- **`app.todos`** (`src/logic/todos.ts`) — **`state`**: **`data`** ( **`Todo[]`** ), **`newTodo`**, **`doneFilter`**, **`search`** (each a **`Store`**).
- **Actions** — **`todo`** (add/remove/toggle/update/clear), **`visibleTodos.get`** (filter + search), **`update`** helpers for the UI fields.
- **`AppLifeCycle`** persists **`state.data`** to **`localStorage`**.
- **`TodoApp`** and related components subscribe with **`.use()`** and call **`app.todos`**.
- **Types** — **`Todo`**, **`DoneFilter`** in **`src/types/Todo.type.ts`**.

### `Route`

- **`app.route`** (`src/logic/route.ts`, **`BasicRouter`**) — **`state.route`** ( **`{ path, params }`** ), **`navigateToRouteFn`**, and helpers defined in that module.
- Shell and pages read **`app.route`** for **`SwitchV`** and navigation so the UI tracks the URL ([Routing](#routing)).

### Persisted snapshot (`localStorage`)

- **`src/localStorage.ts`** — types, defaults, and helpers for the JSON snapshot.
- **`AppLifeCycle`** keeps persisted fields aligned with live **`Store`** state. See **`LocalStorageState`** and **`initialLocalStorageState`**.

### Session refs (`globalRef`)

- **`src/globalRef.ts`** — plain mutable object (no **`Store`**, no persistence).
- **Use** — shared across logic modules when **`Store`** is wrong: no subscriptions, no persistence (e.g. history, library refs, update-only state).

### `Lang` and translations

- **`src/dict/index.ts`** — defines **`Lang`** and lazy lang chunks.
- **`AppLifeCycle`** loads the active dict chunk; runtime strings live in **`app.tr`** (`src/logic/tr.ts`).

### `Config`

- **`app.config`** (`src/logic/config.ts`) — holds **`DEFAULT_CONFIG`** from **`src/config/cliConfig.ts`** (todo UI tuning).
- **`STATIC_CONFIG`** — same file; values that should not change at runtime (e.g. base URL for the router).

_[back to top](#project-understanding)_

## Features

- **Home** — landing copy, language toggle, dark/light control, navigation to the todo screen.
- **Routing** — **`BasicRouter`** / **`app.route`**, **`SwitchV`** in **`App.tsx`**, 404; Easy React Router–compatible paths if you adopt `src/routes/` later (see [Routing](#routing)).
- **Todo app (example)** — add/remove/toggle/edit todos, filter (all/active/completed), search, clear completed; styling knobs via `config`.
- **Internationalization** — English/French (extend under `src/dict/lang/`).
- **Theme** — `data-theme` on the document root for CSS.
- **Persistence** — todos, language, theme, and config survive reloads via `localStorage`.
- **Optional API** — mock or Treaty client; toggle in `src/api/api.config.ts`; base URL in `src/config/srvConfig.ts`.

_[back to top](#project-understanding)_

## Related docs

- **`How-to.md`** — how to add a route, logic, data to localStorage, config, translation (lang or word).
- **[Easy React Router](https://github.com/nicolasventer/Easy-React-Router)** — file-based `src/routes/`, Vite plugin, and static route generation. Path conventions and navigation-style API align with **BasicRouter** so you can migrate without redesigning routes.
