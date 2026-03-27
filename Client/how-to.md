# How-to

This guide documents the main extension points in this template: routing, domain logic, persistence, configuration, and translations.

## Table of contents

- [How-to](#how-to)
  - [Table of contents](#table-of-contents)
  - [How to add a route](#how-to-add-a-route)
    - [Manual routing (default)](#manual-routing-default)
    - [File-based routing (Easy React Router)](#file-based-routing-easy-react-router)
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

The template supports two approaches: the **default** manual router (`app.route` + `SwitchV`), or **file-based** routes under [`src/routes/`](src/routes/) via [Easy React Router](https://github.com/nicolasventer/Easy-React-Router).

### Manual routing (default)

Routing is custom: URL parsing and navigation live in [`src/logic/route.ts`](src/logic/route.ts), and the UI switch is in [`src/pages/App.tsx`](src/pages/App.tsx).

1. in [`src/logic/route.ts`](src/logic/route.ts)
   1. expand the `Route` type  
      Try to match the URL with the parameters.  
      Tip: if you do not deploy as a SPA, prefer optional query params like `?key=value` instead of mandatory path params like `/:value`.
   2. update `_getRouteFromCurrentUrl` to return the matching `Route` variant
   3. update `_getUrlFromRoute` to generate the correct URL
2. in [`src/pages/`](src/pages/), create the page component corresponding to the new route
3. in [`src/pages/App.tsx`](src/pages/App.tsx), add the case in `SwitchV` (ensure the `cases` key/discriminant matches what `Route` uses)

### File-based routing (Easy React Router)

Routing is file-based. Installation, Vite plugin, URL ↔ file mapping, layouts, lazy routes, static hosting, and the rest of the API are all described in the [Easy React Router README](https://github.com/nicolasventer/Easy-React-Router).

1. in [`src/routes/`](src/routes/), create or change a route file (naming and path rules are in that README).
2. if your editor (VS Code, Cursor, …) opens [`src/routerInstance.gen.ts`](src/routerInstance.gen.ts), close it **without saving** so you do not keep a stale buffer over the regenerated file and routes stay correct.

_[↑ Back to top](#how-to)_

---

## How to add logic

Domain logic lives under [`src/logic/`](src/logic/). The public entry is [`src/logic/index.ts`](src/logic/index.ts), which exports `app` (use `app` in components instead of importing many logic modules directly).

1. in [`src/logic/`](src/logic/), create a new logic file
2. if needed, in [`src/types/`](src/types/), create all the types you need to export
   - no need to put types only used in private outside of the logic file
3. in the logic file:
   1. create a state object that contains values that change the render
   2. create a ref object that contains values that does not change the render
   3. create functions used to update the states
      - private (not exported) functions should be prefixed with `'_` (example: `_loadSomething`)
   4. create functions used to compute derived values
   5. export everything in a variable corresponding to the current logic
      - Tip: each logic should be isolated; if an update depends on other values, pass those values in as parameters.
4. re-export the new logic in [`src/logic/index.ts`](src/logic/index.ts)

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

Translations are organized as language modules under [`src/dict/lang/`](src/dict/lang/), and English is the reference key set.

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
