# Project Understanding

## Overview

This document summarizes how this **React + TypeScript + Vite** template is organized: layers (`config`, `shared`, `app`, `features`), routing, state, persistence, i18n, configuration, and the ESLint rules that keep modules decoupled.

The codebase is split into a thin **app shell** (`src/app/`) and pluggable **features** (`src/features/`). Shared infrastructure lives under `src/shared/`. Components import named logic modules directly (for example `route`, `tr`, `counter`) rather than a monolithic façade object.

_[back to top](#project-understanding)_

## Code organization

### Repository structure

```
.
├── folderStructure.mjs        # ESLint: allowed folders/files under src/
├── independentModules.mjs     # ESLint: per-area import allowlists
├── config.jsonc               # Runtime feature flags and settings (validated at build/boot)
├── config.schema.json         # JSON Schema generated from config/Config.ts
└── src/
    ├── index.tsx              # React entry: config bootstrap, createRoot, StrictMode
    ├── index.css              # Global styles
    ├── featureRegister.tsx    # Maps config.features → enabled Feature objects
    ├── config/
    │   ├── Config.ts          # TypeBox schema, defaults, B_PROD, getLocalStorageKey, config CLI
    │   └── bootstrap/
    │       └── config.tsx     # Load and validate config.jsonc; render error UI on failure
    ├── app/                   # Application shell (not feature-specific)
    │   ├── App.tsx            # Layout, nav, SwitchV routing
    │   ├── assets/            # Shell assets (favicon, …)
    │   ├── components/        # Shell UI (AppLifeCycle, LangButton, DarkModeButton)
    │   ├── dict/              # Shell i18n (home, theme, lang, notFound)
    │   ├── logic/             # Shell domain modules (independent from each other)
    │   ├── pages/             # Shell pages (Home, NotFound)
    │   └── types/             # Shell-only *.type.ts
    ├── features/              # Pluggable feature modules
    │   ├── counter/
    │   │   ├── index.ts       # Feature export (route + link)
    │   │   ├── components/
    │   │   ├── dict/
    │   │   └── logic/
    │   └── timer/
    │       └── …              # Same layout per feature
    └── shared/                # Cross-cutting infrastructure
        ├── logic/             # Shared domain (e.g. lang)
        ├── types/             # Shared types (Feature, Router, Lang, …)
        └── utils/             # Store, BasicRouter, hooks, MultiIf / SwitchV, helpers
            └── hooks/
```

_[back to top](#project-understanding)_

## Layer boundaries

| Layer         | Role                                                           | May import from                                                        |
| ------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **config**    | TypeBox schema, validation CLI, bootstrap before app mounts    | `config/**` only                                                       |
| **shared**    | Store, router utils, shared types                              | `shared/**`, `config/**`                                               |
| **app**       | Shell routing, theme, shell i18n, layout                       | `app/**`, `featureRegister`, feature entry points, `config/**`, `shared/**` |
| **features**  | Self-contained routes, UI, logic, and translations per domain  | Same feature, `config/**`, `shared/**` — **not** `app/**`              |

[`src/featureRegister.tsx`](src/featureRegister.tsx) sits at the `src/` root and wires enabled features from `config.jsonc` into the router and nav.

Within `app/logic/` and `features/*/logic/`, each file is **independent** and must not import sibling logic modules. Components subscribe with `.use()` and pass values into logic functions as parameters.

_[back to top](#project-understanding)_

## Routing

- **Router** — `BasicRouter` in `src/app/logic/route.ts`, typed with `RouterPath` from `src/shared/types/Router.ts`.
- **Paths** — Core shell paths (`/`, `/404`) plus paths declared by enabled features in `featureRegister.tsx`. Path strings follow **BasicRouter** conventions (`/segments`, `:name` for path segments, trailing `?key` for optional query params).
- **Feature routes** — Each feature exports a `Feature` object (`src/shared/types/Feature.ts`) with `route` (from `createRoute`) and `link` (`{ path, params? }` for nav defaults and typed query values). Augment `RouterPathObj` in the feature `index.ts` for type-safe paths.
- **Production base route** — When `B_PROD` is `true` in `src/config/Config.ts`, `route.ts` sets the router base (for example `/React-Project-Template` for GitHub Pages deploys).
- **Navigation** — `route.fn.navigateToRouteFn`, `route.fn.navigateToCustomRouteFn`, `route.fn.buildRouteLink` from `src/app/logic/route.ts`.
- **UI** — `route.router.use()` for `{ path, params }`, then `SwitchV` in `App.tsx`. Pass the **full route object** as `value` and use `transform` to narrow to `path` so param changes re-render the correct branch.

_[back to top](#project-understanding)_

## Tech stack

| Area                | Technology                                                                                           |
| ------------------- | ---------------------------------------------------------------------------------------------------- |
| **Language**        | TypeScript                                                                                           |
| **UI**              | React 19                                                                                             |
| **Bundler / dev**   | Vite 8                                                                                               |
| **State**           | Custom `Store` (`src/shared/utils/Store.ts`) + logic modules in `app/logic/` and `features/*/logic/` |
| **Routing**         | `BasicRouter` + `route` in `app/logic/route.ts` + `SwitchV` in `app/App.tsx`                         |
| **Config**          | `config.jsonc` validated by TypeBox schema in `config/Config.ts`; loaded in `config/bootstrap/config.tsx` |
| **HTTP (optional)** | `ApiCaller` (`src/shared/utils/ApiCaller.ts`) — wire up when a feature needs an API client           |
| **i18n**            | Lazy-loaded `dict/lang/*` per surface (app shell + each feature); runtime strings in `tr` stores     |
| **Persistence**     | Per-key `localStorageStore` in `Store.ts` (lang, color scheme, …)                                    |
| **Quality**         | ESLint (React, TypeScript, folder structure, independent modules)                                    |

_[back to top](#project-understanding)_

## Entry, shell, and lifecycle

### `src/index.tsx` (entry)

Imports `@/config/bootstrap/config` first so invalid config fails fast (with an error page). Then mounts `App` under `StrictMode`.

### `src/app/App.tsx` (application shell)

- **Layout** — header with brand, feature nav links, language and theme controls.
- **Routing** — `SwitchV` on `route.router` for `/`, `/404`, and enabled feature routes.
- **Lifecycle** — renders `AppLifeCycle` once near the root.

### `src/app/components/AppLifeCycle.tsx` (shell effects)

Headless component (`null` render) for store-driven effects:

- **i18n** — when `lang.data` changes, load the matching `app/dict` chunk into `tr`.
- **Theme** — set `data-theme` on `document.documentElement` when `colorScheme.data` changes.

Feature components mount their own `*LifeCycle` for feature-scoped translations (for example `CounterLifeCycle`, `TimerLifeCycle`).

_[back to top](#project-understanding)_

## State, `Store`, and logic boundaries

- **`Store`** (`src/shared/utils/Store.ts`): `setValue`, `use()`, `useState()`, `useEffect`; optional updates wrapped in `document.startViewTransition`.
- **`localStorageStore`**: persists a single key (prefixed via `getLocalStorageKey` from `config/Config.ts`) on each update.
- **`Store.value`**: use **only inside the logic file** that owns the store. Elsewhere, read with `.use()` / `.useState()`.
- **Cross-domain data**: logic functions take external values as **parameters**; components subscribe with `.use()` and pass arguments — logic files do not import sibling logic modules.
- **Debug** — `window.store.data` (snapshot) or `window.store.watch` (subscribe from the console) for stores created with a `debugLabel`.

_[back to top](#project-understanding)_

## Entity definitions

### `Route`

- **`route`** (`src/app/logic/route.ts`) — `router` store (`{ path, params }`), `fn.navigateToRouteFn`, `fn.navigateToCustomRouteFn`, `fn.buildRouteLink`.
- Built from `enabledFeatures` so only config-enabled feature paths are registered.

### `Lang` and shell translations

- **`lang`** (`src/shared/logic/lang.ts`) — persisted language choice, loading flag, `fn.updateFn`.
- **`tr`** (`src/app/logic/tr.ts`) — active shell translation bundle; `AppLifeCycle` loads `app/dict` chunks when language changes.
- **`src/app/dict/`** — shell strings (home, theme, lang switcher, 404). See `src/app/dict/README.md` for key conventions.

### `ColorScheme`

- **`colorScheme`** (`src/app/logic/colorsScheme.ts`) — persisted light/dark mode; `AppLifeCycle` syncs `data-theme`.

### Feature example: `counter`

- **`counter`** (`src/features/counter/logic/counter.ts`) — `count` store, `fn.initState`, `fn.addToCountFn`.
- **`tr`** (`src/features/counter/logic/tr.ts`) — feature translation store; `CounterLifeCycle` loads `features/counter/dict`.
- **`CounterFeature`** (`src/features/counter/index.ts`) — route `/counter?start`, default link `{ path: "/counter?start", params: { start: "10" } }`.
- Increment step from `config.features.counter.specific.increment` (see `config.jsonc`).

### Feature example: `timer`

- **`TimerFeature`** (`src/features/timer/index.ts`) — route `/timer?interval`, default link `{ path: "/timer?interval", params: { interval: "100" } }`.
- Timer UI reads `interval` from the query string; feature-scoped `tr` and `dict`.
- Timer UI reads `interval` from the query string; feature-scoped `tr` and `dict`.

### `Config`

- **`config.jsonc`** — source of truth for feature toggles and feature-specific settings.
- **`config/Config.ts`** — TypeBox schema, `getValidConfig`, `getLocalStorageKey`, `B_PROD`, default config; run `bun run config` to regenerate schema and default jsonc.
- **`config/bootstrap/config.tsx`** — exports validated `config` for the running app.

_[back to top](#project-understanding)_

## Features

- **Home** — landing copy from shell `tr`; language and theme controls in the header.
- **Routing** — `BasicRouter` / `route`, `SwitchV` in `App.tsx`, 404 page; feature routes registered via `featureRegister`.
- **Counter** — increment/decrement with config-driven step; optional `start` query param.
- **Timer** — elapsed time display with configurable `interval` query param.
- **Internationalization** — English/French for shell and each feature; lazy-loaded per surface.
- **Theme** — `data-theme` on the document root for CSS.
- **Persistence** — language and color scheme survive reloads via `localStorageStore`.
- **Feature flags** — enable or disable features in `config.jsonc` without removing code.

_[back to top](#project-understanding)_

## Related docs

- **[how-to.md](how-to.md)** — add a feature, route, logic, config, translation, ESLint structure.
- **[src/app/dict/README.md](src/app/dict/README.md)** — shell translation key conventions (features follow the same patterns in their own `dict/`).
