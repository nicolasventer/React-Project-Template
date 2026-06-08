# How-to

This guide documents the main extension points in this template: features, routing, domain logic, configuration, persistence, translations, and ESLint structure rules.

## Table of contents

- [How-to](#how-to)
  - [Table of contents](#table-of-contents)
  - [How to add a feature](#how-to-add-a-feature)
  - [How to add a route](#how-to-add-a-route)
    - [Shell page (Home, NotFound, …)](#shell-page-home-notfound-)
    - [Feature route](#feature-route)
  - [How to add logic](#how-to-add-logic)
  - [How to persist state in localStorage](#how-to-persist-state-in-localstorage)
  - [How to add config](#how-to-add-config)
  - [How to add translation (lang or word)](#how-to-add-translation-lang-or-word)
    - [Shell (app) copy](#shell-app-copy)
    - [Feature copy](#feature-copy)
    - [How to add a lang](#how-to-add-a-lang)
    - [How to add a word](#how-to-add-a-word)
  - [How to define project structure (ESLint)](#how-to-define-project-structure-eslint)
  - [How to define module boundaries (ESLint)](#how-to-define-module-boundaries-eslint)

---

## How to add a feature

Features live under [`src/features/<name>/`](src/features/) and are wired through [`src/app/featureRegister.tsx`](src/app/featureRegister.tsx) and [`config.jsonc`](config.jsonc).

1. create the feature folder with the standard layout:
   - `index.ts` — export a `Feature` object
   - `components/` — route UI + optional `*LifeCycle.tsx` for i18n
   - `dict/` — feature-scoped translations
   - `logic/` — independent logic modules (`state`, `fn`, …)
2. in `index.ts`, augment `RouterPathObj` and export `Feature`:

```ts
declare global {
	interface RouterPathObj {
		"/my-feature?key": "/my-feature?key";
	}
}

export const MyFeature: Feature = {
	route: createRoute("/my-feature?key", MyComponent),
	link: "/my-feature?key=value",
};
```

3. add the feature to `ConfigSchema` in [`src/shared/Config.ts`](src/shared/Config.ts) and to [`config.jsonc`](config.jsonc)
4. register it in [`src/app/featureRegister.tsx`](src/app/featureRegister.tsx)
5. run `bun run lint` — new paths must match [`folderStructure.mjs`](folderStructure.mjs) and [`independentModules.mjs`](independentModules.mjs)

_[↑ Back to top](#how-to)_

---

## How to add a route

[`BasicRouter`](src/shared/utils/BasicRouter.ts) owns URL matching, `history` updates, and link building. [`src/app/logic/route.ts`](src/app/logic/route.ts) builds the router from shell paths plus enabled feature routes. The UI picks the page in [`src/app/App.tsx`](src/app/App.tsx) via `SwitchV`.

### Shell page (Home, NotFound, …)

1. add the path string to the array in `new BasicRouter([...], …)` in [`src/app/logic/route.ts`](src/app/logic/route.ts) if it is not already there
2. extend `RouterPathObj` in [`src/shared/types/Router.ts`](src/shared/types/Router.ts)
3. create the page under [`src/app/pages/`](src/app/pages/)
4. add a `SwitchV` case in [`src/app/App.tsx`](src/app/App.tsx) with the same path string

Paths use `/segments`, `:name` for path segments, and a trailing `?key` segment for optional query parameters (for example `/counter?start`).

### Feature route

Prefer declaring the route on the feature `index.ts` (see [How to add a feature](#how-to-add-a-feature)). The path is picked up automatically when the feature is enabled in config — no manual `SwitchV` entry needed.

Use `route.fn.navigateToRouteFn(...)` or `route.fn.navigateToCustomRouteFn(...)` from components; use `route.fn.buildRouteLink` when you need an `href`.

_[↑ Back to top](#how-to)_

---

## How to add logic

Domain logic lives in [`src/app/logic/`](src/app/logic/) (shell) or [`src/features/<name>/logic/`](src/features/) (feature). Import named exports in components — there is no central `app` aggregator.

1. create a new `.ts` file in the appropriate `logic/` folder
2. if needed, add types under [`src/app/types/`](src/app/types/) or [`src/shared/types/`](src/shared/types/)
3. export one object for the domain (for example `counter`) built from these namespaces (use only what you need):
   1. **`state`** – reactive stores (`store(...)`, `localStorageStore(...)`) for values that should trigger a re-render
   2. **`ref`** – plain objects for mutable values that should **not** trigger a re-render
   3. **`fn`** – updates, event-handler factories (`…Fn` suffix), derived helpers. Private helpers prefixed with `_`
   4. **`effect`** – custom hooks for DOM or lifecycle behavior used from components
4. keep each logic module isolated — if a function needs values from elsewhere, pass them as parameters from the component
5. see [`src/features/counter/logic/counter.ts`](src/features/counter/logic/counter.ts) for `state` + `fn`; [`src/shared/logic/lang.ts`](src/shared/logic/lang.ts) for persisted shared state

_[↑ Back to top](#how-to)_

---

## How to persist state in localStorage

Persistence uses per-key stores via `localStorageStore` in [`src/shared/utils/Store.ts`](src/shared/utils/Store.ts). Keys are prefixed with `getLocalStorageKey` from [`src/shared/Config.ts`](src/shared/Config.ts).

1. in your logic module, create state with `localStorageStore<T>(getLocalStorageKey("myKey"), defaultValue)`
2. read in components with `.use()`; write with `.setValue()` inside the owning logic file
3. no separate sync effect is required — `localStorageStore` persists on each update

Examples: `lang.data` in [`src/shared/logic/lang.ts`](src/shared/logic/lang.ts), `colorScheme.data` in [`src/app/logic/colorsScheme.ts`](src/app/logic/colorsScheme.ts).

_[↑ Back to top](#how-to)_

---

## How to add config

Runtime config is defined in [`config.jsonc`](config.jsonc), validated by the TypeBox schema in [`src/shared/Config.ts`](src/shared/Config.ts), and loaded by [`src/bootstrap/config.tsx`](src/bootstrap/config.tsx).

1. extend `ConfigSchema` in [`src/shared/Config.ts`](src/shared/Config.ts) and `DefaultConfig`
2. run `bun run config` to regenerate [`config.schema.json`](config.schema.json) and refresh the default jsonc
3. update [`config.jsonc`](config.jsonc) with your values
4. import `config` from `@/bootstrap/config` where needed (for example feature components reading `config.features.counter.specific`)

_[↑ Back to top](#how-to)_

---

## How to add translation (lang or word)

Translations are split by surface:

- **Shell** — [`src/app/dict/`](src/app/dict/) (home, theme, lang, notFound)
- **Features** — [`src/features/<name>/dict/`](src/features/) (feature-specific copy)

Conventions for surface-scoped dicts, two-level key shape, and placeholders are documented in [`src/app/dict/README.md`](src/app/dict/README.md). Feature dicts follow the same rules.

Each surface has its own `tr` store (`src/app/logic/tr.ts` or `src/features/*/logic/tr.ts`) and a `*LifeCycle` component that loads the active lang chunk when `lang.data` changes.

### Shell (app) copy

Edit [`src/app/dict/lang/en.ts`](src/app/dict/lang/en.ts) and mirror keys in other lang files under [`src/app/dict/lang/`](src/app/dict/lang/).

### Feature copy

Edit [`src/features/<name>/dict/lang/en.ts`](src/features/) and mirror keys in that feature's other lang files.

### How to add a lang

1. add the lang to the `Lang` type in [`src/shared/types/Lang.ts`](src/shared/types/Lang.ts)
2. create `lang/<code>.ts` in **each** dict that should support the new lang (app + relevant features)
3. include all keys from the matching `en.ts`
4. register the lazy loader in each `dict/index.ts`

### How to add a word

1. add the key in the relevant `en.ts` first (that file defines `Tr`)
2. mirror the same nested structure in every other language file for that surface
3. use the new path from components (for example `tr.home.title` or `tr.counter.increment`)

_[↑ Back to top](#how-to)_

---

## How to define project structure (ESLint)

The allowed folder and file layout under [`src/`](src/) is defined in [`folderStructure.mjs`](folderStructure.mjs) using `eslint-plugin-project-structure`. ESLint loads it in [`eslint.config.js`](eslint.config.js) via the rule `project-structure/folder-structure`.

1. open [`folderStructure.mjs`](folderStructure.mjs) and update the `structure` tree under the [`src/`](src/) node
   - or add reusable rules referenced by `ruleId` (for example `feature-folder`, `app-components-folder`)
2. if you introduce a new top-level folder under `src/`, add it explicitly in `structure`
3. run `bun run lint` and fix reported path or naming issues until the tree matches the config

Tips:

- reuse existing `ruleId` entries when nesting follows the same conventions
- feature folders use `{camelCase}` names (`counter`, `timer`, …)
- component and page styles use `{PascalCase}.module.css`

_[↑ Back to top](#how-to)_

---

## How to define module boundaries (ESLint)

Which files may import which other files is defined in [`independentModules.mjs`](independentModules.mjs) using `createIndependentModules`. ESLint applies it with `project-structure/independent-modules` in [`eslint.config.js`](eslint.config.js).

Concepts:

- each `modules` entry has:
  - `pattern` (glob)
  - `allowImportsFrom` (allowed import globs and placeholders)
  - optional `errorMessage`
- `{shared}` maps to `src/shared/**`
- `{dirname}` refers to the directory of the importing file
- the last matching rule wins
- there is a catch-all for [`src/**`](src/**) ("Unknown files") that forbids all imports if no earlier rule matched
  - so every new file under [`src/`](src/) must match at least one `modules` entry

Typical workflow:

1. when you add a new area (for example a new feature or app subfolder), add a `modules` entry with the right `pattern` and `allowImportsFrom`
2. if many modules should share the same imports, add or extend a key under `reusableImportPatterns` and reference it in `allowImportsFrom`
3. run `bun run lint` and adjust rules until imports match the architecture (features must not import `app/**`; logic modules must not import sibling logic)

_[↑ Back to top](#how-to)_
