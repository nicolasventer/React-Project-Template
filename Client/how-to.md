# How-to

This guide documents the main extension points in this template: routing, domain logic, persistence, configuration, and translations.

## Table of contents

- [How-to](#how-to)
  - [Table of contents](#table-of-contents)
  - [How to add a route](#how-to-add-a-route)
    - [BasicRouter (default)](#basicrouter-default)
    - [File-based routing (Easy React Router)](#file-based-routing-easy-react-router)
    - [Static HTML (`staticRoutes.yaml`)](#static-html-staticroutesyaml)
  - [How to add logic](#how-to-add-logic)
  - [How to add data to localStorage](#how-to-add-data-to-localstorage)
  - [How to add config](#how-to-add-config)
  - [How to add translation (lang or word)](#how-to-add-translation-lang-or-word)
    - [How to add a lang](#how-to-add-a-lang)
    - [How to add a word](#how-to-add-a-word)
  - [How to define project structure (ESLint)](#how-to-define-project-structure-eslint)
  - [How to define module boundaries (ESLint)](#how-to-define-module-boundaries-eslint)

---

## How to add a route

The template supports two approaches: the **default** [`BasicRouter`](src/utils/BasicRouter.ts) wired in [`src/logic/route.ts`](src/logic/route.ts) (`app.route` + `SwitchV` in [`src/pages/App.tsx`](src/pages/App.tsx)), or **file-based** routes under [`src/routes/`](src/routes/) via [Easy React Router](https://github.com/nicolasventer/Easy-React-Router).

### BasicRouter (default)

[`BasicRouter`](src/utils/BasicRouter.ts) owns URL matching, `history` updates, and link building. [`src/logic/route.ts`](src/logic/route.ts) constructs the router with a **path list**, sets the base URL from config, and re-exports navigation helpers on `app.route`. The current route is a reactive store (`app.route.state.route`); the UI picks the page in [`src/pages/App.tsx`](src/pages/App.tsx) via `SwitchV` on `route.path`.

1. in [`src/logic/route.ts`](src/logic/route.ts)
   1. add your path string to the array passed to `new BasicRouter([...], …)`  
      Paths use `/segments`, `:name` for path segments, and a trailing `?key` segment for optional query parameters (for example `/todo?id` matches `/todo` with `id` in the query string).  
      Tip: if you do not deploy as a SPA, prefer optional query-style segments like `?key` over mandatory `/:value` segments where it helps.
   2. if you need typed navigation from logic, add helpers that call `router.navigateToRouteFn` / `router.buildRouteLink` (see existing `todo` helpers).
2. in [`src/pages/`](src/pages/), create the page component for the new route
3. in [`src/pages/App.tsx`](src/pages/App.tsx), add a `SwitchV` case whose key is the **same path string** as in the router list; read `params` from the store value when the route has parameters

Use `app.route.navigateToRouteFn(...)` (or wrappers on `route`) from components and logic to navigate; use `router.buildRouteLink` patterns via `route.ts` if you need hrefs elsewhere.

### File-based routing (Easy React Router)

Routing is file-based. Installation, Vite plugin, URL ↔ file mapping, layouts, lazy routes, static hosting, and the rest of the API are all described in the [Easy React Router README](https://github.com/nicolasventer/Easy-React-Router).

1. in [`src/routes/`](src/routes/), create or change a route file (naming and path rules are in that README).
2. if your editor (VS Code, Cursor, …) opens [`src/routerInstance.gen.ts`](src/routerInstance.gen.ts), close it **without saving** so you do not keep a stale buffer over the regenerated file and routes stay correct.

### Static HTML (`staticRoutes.yaml`)

**staticRoutes.yaml** should contain all routes that should be generated as static HTML files. It needs to be updated manually when using **`BasicRouter`**. It can be updated automatically with **`Easy React Router`**. It is used for deployment.

1. open [`staticRoutes.yaml`](staticRoutes.yaml) at the **Client** root (next to `_genHtml.ts`)
2. add one line per **fully spelled** static URL you need, for example `- /about` or `- /` for the home shell
3. **Dynamic routes** — this step cannot “solve” `/posts/:id` for every id; you only get files for **exact** paths you add (for example `- /posts/0` for one known slug). For open-ended variation, a better approach is **optional parameters**: one stable URL and optional query-style segments.
4. run a production build so `dist/` is regenerated with the extra `.html` files

_[↑ Back to top](#how-to)_

---

## How to add logic

Domain logic lives under [`src/logic/`](src/logic/). The public entry is [`src/logic/index.ts`](src/logic/index.ts), which exports `app` (use `app` in components instead of importing many logic modules directly).

1. in [`src/logic/`](src/logic/), create a new logic file
2. if needed, in [`src/types/`](src/types/), create all the types you need to export
   - no need to put types only used in private outside of the logic file
3. in the logic file, export one object for the domain (for example `todos`) built from these namespaces (use only what you need):
   1. **`state`** – reactive stores (`store(...)`) for values that should trigger a re-render when they change
   2. **`ref`** – plain objects for mutable values that should **not** trigger a re-render (flags, cached IDs between navigations, ...)
   3. **`fn`** – functions: updates, navigation factories, helpers that compute derived values, event-handler factories (`…Fn` suffix when the value is a function that returns a handler). Private helpers that are not part of the exported API should be prefixed with `'_` (example: `_loadSomething`). Group related APIs in nested objects
   4. **`effect`** – custom hooks (usually wrapping `useEffect`) for DOM or lifecycle behavior used from components
   - Tip: keep each logic module isolated; if a function needs values from elsewhere, pass them in as parameters.
   - See [`src/logic/todos.ts`](src/logic/todos.ts) for `state`, `ref`, `fn`, and `effect`; [`src/logic/lang.ts`](src/logic/lang.ts) for a smaller module with only `state` and `fn`.
4. re-export the new logic in [`src/logic/index.ts`](src/logic/index.ts) and attach it to `app`

_[↑ Back to top](#how-to)_

---

## How to add data to localStorage

Persistence uses a single JSON blob in [`src/localStorage.ts`](src/localStorage.ts), updated from [`src/components/app/AppLifeCycle.tsx`](src/components/app/AppLifeCycle.tsx).

1. in [`src/localStorage.ts`](src/localStorage.ts), expand type `LocalStorageState`
   - be sure that every value is valid for `JSON.stringify` (no `Map`, no `Date`, ...)
2. update `_loadLocalStorageState` with a default value
3. in the logic that consumes the value, create state initialized from `initialLocalStorageState`
4. in [`src/components/app/AppLifeCycle.tsx`](src/components/app/AppLifeCycle.tsx), update the effect that synchronizes the localStorage so the new field is written whenever it changes

_[↑ Back to top](#how-to)_

---

## How to add config

[`src/config/cliConfig.ts`](src/config/cliConfig.ts) contains the defaults and shape. Runtime access is handled by [`src/logic/config.ts`](src/logic/config.ts), which uses the persisted values from `initialLocalStorageState`.

1. in [`src/config/cliConfig.ts`](src/config/cliConfig.ts)
   - if you want persistence and console updates, add the value to `DEFAULT_CONFIG`
   - otherwise, export the value outside of `DEFAULT_CONFIG`
2. if the value should persist:
   1. ensure it exists on `LocalStorageState`
   2. ensure [`src/components/app/AppLifeCycle.tsx`](src/components/app/AppLifeCycle.tsx) includes it in the `app.localStorage.update({ ... })` payload
3. use `app.config` in UI following the existing template patterns

_[↑ Back to top](#how-to)_

---

## How to add translation (lang or word)

Translations are organized as language modules under [`src/dict/lang/`](src/dict/lang/), and English is the reference key set. Conventions for section order, subgroups (`heading`, `action`, `status`, …), and placeholders are documented in [`src/dict/README.md`](src/dict/README.md).

### How to add a lang

1. in [`src/dict/lang/`](src/dict/lang/), create a file corresponding to the new lang
2. include all the keys from [`src/dict/lang/en.ts`](src/dict/lang/en.ts) (keys must stay consistent across languages)

### How to add a word

1. in [`src/dict/lang/en.ts`](src/dict/lang/en.ts), add the new key
2. add the translation for that key in all other languages

_[↑ Back to top](#how-to)_

---

## How to define project structure (ESLint)

The allowed folder and file layout under [`src/`](src/) is defined in [`folderStructure.mjs`](folderStructure.mjs) using `eslint-plugin-project-structure`. ESLint loads it in [`eslint.config.js`](eslint.config.js) via the rule `project-structure/folder-structure`.

1. open [`folderStructure.mjs`](folderStructure.mjs) and update the `structure` tree under the [`src/`](src/) node

- or add reusable rules referenced by `ruleId`, matching the plugin naming patterns (for example `{PascalCase}.tsx`, `{camelCase}.ts`, `{snake_case}.ts` under [`src/dict/lang/`](src/dict/lang/))

2. if you introduce a new top-level folder under `src/`, add it explicitly in `structure`
3. run lint and fix reported path or naming issues until the tree matches the config

Tips:

- reuse existing `ruleId` entries (pages-folder, logic-folder, components-folder, and so on) when nesting follows the same conventions
- keep file naming aligned with patterns already used in each folder so you do not need to widen rules unnecessarily

_[↑ Back to top](#how-to)_

---

## How to define module boundaries (ESLint)

Which files may import which other files is defined in [`independentModules.mjs`](independentModules.mjs) using `createIndependentModules`. ESLint applies it with `project-structure/independent-modules` in [`eslint.config.js`](eslint.config.js).

Concepts:

- each `modules` entry has:
  - `pattern` (glob)
  - `allowImportsFrom` (allowed import globs and placeholders)
  - optional `errorMessage`
- placeholders like `{global}` and `{readWriteStates}` map to reusable import allow-lists
- the last matching rule wins
- there is a catch-all for [`src/**`](src/**) ("Unknown files") that forbids all imports if no earlier rule matched
  - so every new file under [`src/`](src/) must match at least one `modules` entry

Typical workflow:

1. when you add a new area of the codebase (a new subtree under [`src/`](src/)), add a `modules` entry with the right `pattern` and `allowImportsFrom`
2. if many modules should share the same imports, add or extend a key under `reusableImportPatterns` and reference it as `{thatKey}` in `allowImportsFrom`
3. run lint and adjust rules until imports match the architecture you want (for example keeping `config` and `dict` isolated from UI layers)

_[↑ Back to top](#how-to)_
