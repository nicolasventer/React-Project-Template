# Project Understanding

## Overview

This document summarizes how this **React + TypeScript + Vite** template is organized: folders, routing, global state, persistence, i18n, and the ESLint rules that keep modules decoupled.

The app exposes a single façade object **`app`** from `src/logic/index.ts`. Pages and components import `@/logic` and use `app.route`, `app.todos`, `app.tr`, and so on. Each file under `src/logic/` (except `index.ts`) is **independent** and must not import sibling logic modules.

_[back to top](#project-understanding)_

## Code organization

### Client structure (`src/`)

```
src/
├── index.tsx              # React entry: createRoot, StrictMode, global CSS
├── index.css
├── localStorage.ts        # Load/save one persisted snapshot; sync driven from AppLifeCycle
├── vite-env.d.ts
├── api/                   # Eden Treaty client, mock, generated types, api.config
├── assets/                # Static assets (images, fonts, …) per folderStructure rules
├── components/            # React UI; feature folders + _common/ + app/ (e.g. AppLifeCycle)
├── config/                # cliConfig (defaults/types), srvConfig (API base URL)
├── dict/                  # i18n: index + lazy lang/*.ts chunks
├── logic/                 # Domain modules (independent) + index.ts → app
├── pages/                 # Top-level screens (App shell, Home, Todo, NotFound, …)
├── routes/                # Reserved by ESLint folder rules (optional future use)
├── types/                 # Shared *.type.ts
└── utils/                 # Store, hooks, MultiIf / SwitchV, helpers
```

Enforced layout: `folderStructure.mjs`. Import boundaries: `independentModules.mjs`.

_[back to top](#project-understanding)_

## Tech stack

| Area                | Technology                                                               |
| ------------------- | ------------------------------------------------------------------------ |
| **Language**        | TypeScript                                                               |
| **UI**              | React 19                                                                 |
| **Bundler / dev**   | Vite 8                                                                   |
| **State**           | Custom `Store` (`src/utils/Store.ts`) + domain modules in `src/logic/`   |
| **Routing**         | Custom: `history` + `src/logic/route.ts` + `SwitchV` in `pages/App.tsx`  |
| **HTTP (optional)** | `@elysiajs/eden` Treaty client (`src/api/api.ts`), types in `api.gen.ts` |
| **i18n**            | Lazy-loaded `dict/lang/*`, strings in `app.tr`                           |
| **Persistence**     | Single `localStorage` JSON blob (`src/localStorage.ts`)                  |
| **Quality**         | ESLint (React, TypeScript, folder structure, independent modules)        |

_[back to top](#project-understanding)_

## Entry, shell, and lifecycle

| File                                      | Role                                                                                                                                    |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **`src/index.tsx`**                       | Mount the app, import global CSS; optional one-off library setup (e.g. dayjs locale) that does not need React context.                  |
| **`src/pages/App.tsx`**                   | Application shell: providers (when you add them), routing (`SwitchV` + `app.route`), mount **`AppLifeCycle`**, app-wide modals/portals. |
| **`src/components/app/AppLifeCycle.tsx`** | Headless component: effects on state changes — load translations when `lang` changes, persist to `localStorage`,                        |
|                                           | update `document.documentElement` / CSS variables.                                                                                      |

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

`src/localStorage.ts` defines a single persisted shape: language, color scheme, todo list, and client UI config — see `LocalStorageState` and `initialLocalStorageState`.

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
