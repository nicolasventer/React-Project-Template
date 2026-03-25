# How-to

This guide describes common extension points in this template: ESLint project rules, routing, domain logic, persistence, configuration, and translations.

**Note: This guide is a draft that need to be updated.**

## Table of contents

- [How-to](#how-to)
  - [Table of contents](#table-of-contents)
  - [How to add a route](#how-to-add-a-route)
  - [How to add logic](#how-to-add-logic)
  - [How to add data to localStorage](#how-to-add-data-to-localstorage)
  - [How to add config](#how-to-add-config)
  - [How to add translation (lang or word)](#how-to-add-translation-lang-or-word)
  - [How to define project structure (ESLint)](#how-to-define-project-structure-eslint)
  - [How to define module boundaries (ESLint)](#how-to-define-module-boundaries-eslint)

---

## How to add a route

Routing is custom: URL parsing and navigation live in [`src/logic/route.ts`](src/logic/route.ts); the UI switch is in [`src/pages/App.tsx`](src/pages/App.tsx).

**Steps**

1. **Extend the `Route` union** in `route.ts` with the new path shape (including query variants if you use search params).
2. **Parse the URL** in `_getRouteFromCurrentUrl` so the browser location maps to your new `Route` variant.
3. **Build URLs** in `_getUrlFromRoute` for `history.pushState`.
4. **Navigate** from UI with `app.route.navigateToRouteFn({ ... })()` (see existing usage in pages).
5. **Render** the matching screen in `App.tsx` inside `SwitchV`: add a `cases` entry keyed by `route.url` (same discriminant as in your union).

If the new screen is a new page component, place it under `src/pages/` per folder structure rules. [`src/index.tsx`](src/index.tsx) is allowed to import `src/pages/**`; you usually only need to wire the page inside `App.tsx`.

_[↑ Back to top](#how-to)_

---

## How to add logic

Domain state and behavior live under [`src/logic/`](src/logic/). The public facade is [`src/logic/index.ts`](src/logic/index.ts), which exports the `app` object—use **`app`** in components instead of importing many logic files.

**Steps**

1. Add a file such as `src/logic/myFeature.ts` (naming follows the `logic-folder` rule in `folderStructure.mjs`).
2. Use [`store`](src/utils/Store.ts) for reactive state where appropriate; follow existing modules ([`todos.ts`](src/logic/todos.ts), [`lang.ts`](src/logic/lang.ts)) for patterns.
3. **Import rules:** under [`independentModules.mjs`](independentModules.mjs), files in `src/logic/**` may import only `{global}` (`config`, `dict`, `types`, `utils`) and [`src/localStorage.ts`](src/localStorage.ts)—not arbitrary `src/api/**` or `src/components/**` from a new logic file unless you change the rules.
4. Export a small API object from your module and **register it on `app`** in `logic/index.ts`.

Components in `src/pages/**` and `src/components/**` may import `app` from `@/logic` via the `readWriteStates` pattern (and related allowances).

_[↑ Back to top](#how-to)_

---

## How to add data to localStorage

Persistence uses a **single JSON blob** in [`src/localStorage.ts`](src/localStorage.ts), updated from [`src/components/app/AppLifeCycle.tsx`](src/components/app/AppLifeCycle.tsx).

**Steps**

1. Extend **`LocalStorageState`** with the new field and type.
2. In **`_loadLocalStorageState`**, read from the parsed object and provide a **default** when the key is missing (same pattern as `lang`, `todos`, `config`).
3. **Initialize** any `store` that should start from that value (see [`todos.ts`](src/logic/todos.ts) using `initialLocalStorageState`).
4. In **`AppLifeCycle`**, include the new piece of state in the `useEffect` that calls `app.localStorage.update({ ... })` so it is written whenever it changes.

Avoid importing `localStorageLogic` from random modules if that would violate `independentModules.mjs`; the lifecycle + `app` pattern keeps writes centralized.

_[↑ Back to top](#how-to)_

---

## How to add config

**CLI / client config** (defaults and shape) lives in [`src/config/cliConfig.ts`](src/config/cliConfig.ts). Runtime access and dev helpers are in [`src/logic/config.ts`](src/logic/config.ts), which syncs with persisted state from `initialLocalStorageState`.

**Steps**

1. Add keys to **`DEFAULT_CONFIG`** in `cliConfig.ts`; `Config` is inferred from it.
2. If the value should persist, ensure it exists on **`LocalStorageState`** and in **`AppLifeCycle`**’s `app.localStorage.update` payload (see [How to add data to localStorage](#how-to-add-data-to-localstorage)).
3. Use **`app.config.state.data`** in the UI and **`app.config.value.update` / `reset`** (or `window.config` in the console) as in the existing template.

**Server-side** env-style values belong in [`src/config/srvConfig.ts`](src/config/srvConfig.ts) if you use that file; keep `src/config/**` only importing what `independentModules` allows (`{global}`).

_[↑ Back to top](#how-to)_

---

## How to add translation (lang or word)

Strings are organized as lazy-loaded language modules under [`src/dict/lang/`](src/dict/lang/). The registry is [`src/dict/index.ts`](src/dict/index.ts). Runtime loading is triggered in **`AppLifeCycle`** via `dict[lang]()`.

**Add or change a language**

1. Add `src/dict/lang/<code>.ts` using **snake_case** for the file name (per `folderStructure.mjs`).
2. Export an object of keys to translated strings (see [`en.ts`](src/dict/lang/en.ts)).
3. Register it in **`dict`** in `dict/index.ts` and ensure **`Lang`** / **`LangValues`** stay consistent.
4. For TypeScript, other languages usually use **`import type { Tr } from "./en"`** and **`export const xx: Tr = { ... }`** so every locale implements the same keys as English ([`fr.ts`](src/dict/lang/fr.ts)).

**Add a new word or phrase**

1. Add a key to **`en.ts`** (and every other language file) with the translation.
2. Use it in components via **`app.tr.use()`** (or `app.tr.state.data.use()`) and index the record with your key, e.g. `tr.Home` or `tr["My New Key"]`.

Language switching uses **`app.lang`** ([`lang.ts`](src/logic/lang.ts)); changing `lang` causes **`AppLifeCycle`** to load the matching dict chunk and update **`app.tr`**.

_[↑ Back to top](#how-to)_

---

## How to define project structure (ESLint)

The allowed folder and file layout under `src/` is defined in [`folderStructure.mjs`](folderStructure.mjs) using `createFolderStructure` from [`eslint-plugin-project-structure`](https://www.npmjs.com/package/eslint-plugin-project-structure). ESLint loads it in [`eslint.config.js`](eslint.config.js) via the rule `project-structure/folder-structure`.

**Typical workflow**

1. Open `folderStructure.mjs` and extend the `structure` tree (under the `src` node) or add reusable `rules` referenced by `ruleId`, matching the plugin’s naming patterns (for example `{PascalCase}.tsx`, `{camelCase}.ts`, `{snake_case}.ts` under `dict/lang/`).
2. If you introduce a **new top-level folder** under `src/`, add it explicitly in `structure`; otherwise the folder-structure rule reports an error.
3. Run `npm run lint` (or your package manager equivalent) and fix reported path or naming issues until the tree matches the config.

**Tips**

- Reuse existing `ruleId` entries (`components-folder`, `pages-folder`, `logic-folder`, and so on) when nesting follows the same conventions.
- Keep file naming aligned with the patterns already used in each folder so you do not need to widen rules unnecessarily.

_[↑ Back to top](#how-to)_

---

## How to define module boundaries (ESLint)

Which files may import which other files is defined in [`independentModules.mjs`](independentModules.mjs) using `createIndependentModules`. ESLint applies it with `project-structure/independent-modules` in [`eslint.config.js`](eslint.config.js).

**Concepts**

- Each entry in `modules` has a `pattern` (glob), `allowImportsFrom` (globs and placeholders), and optional `errorMessage`.
- Placeholders like `{global}` and `{readWriteStates}` are expanded from `reusableImportPatterns` so several modules share the same allow list.
- The last matching rule wins. There is a catch-all for `src/**` (“Unknown files”) that **forbids all imports** if no earlier rule matched—so **every new file under `src/` must fall under some module `pattern`**.

**Typical workflow**

1. When you add a new **area** of the codebase (for example a new subtree of `src/`), add a `modules` entry with the right `pattern` and `allowImportsFrom`.
2. If many modules should share the same imports, add or extend a key under `reusableImportPatterns` and reference it as `{thatKey}` in `allowImportsFrom`.
3. Run `npm run lint` and adjust rules until imports match the architecture you want (for example keeping `config` and `dict` isolated from UI layers).

_[↑ Back to top](#how-to)_
