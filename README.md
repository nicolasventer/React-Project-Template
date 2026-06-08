# React + TypeScript + Vite (template)

Opinionated React 19 + Vite 8 + TypeScript starter with ESLint (folder structure and module boundaries), feature-based architecture, config-driven feature flags, and per-surface i18n. See [project-understanding.md](project-understanding.md) for architecture and [how-to.md](how-to.md) for common tasks.

## Prerequisites

- [Bun](https://bun.sh) (recommended; this repo has a `bun.lock`), or Node 20+ with npm/pnpm/yarn
- For `bun run depgraph`: [Graphviz](https://graphviz.org/) (`dot` on your `PATH`)
- For `bun run preview`: the [`serve`](https://www.npmjs.com/package/serve) CLI (install globally or run `bun add -d serve`). If you prefer not to use it, use `bun run _preview` after a build (Vite’s built-in preview server)

## Setup

```bash
bun install
```

Equivalent: `npm install`, `pnpm install`, or `yarn`.

## Commands

Run with `bun run <script>` (or `npm run`, `pnpm run`, `yarn`).

| Script                | Command                | Description                                                              |
| --------------------- | ---------------------- | ------------------------------------------------------------------------ |
| **Config schema**     | `bun run config`       | Regenerate `config.schema.json` and default `config.jsonc` from schema   |
| **Dev server**        | `bun run dev`          | Start Vite dev server (default URL in terminal)                          |
| **Dev (LAN)**         | `bun run devhost`      | Dev server bound to all interfaces (`bunx --bun vite --host`)            |
| **Dev (HTTPS)**       | `bun run devhttps`     | Dev server with HTTPS (`USE_HTTPS=true`, uses `npx vite`)                |
| **Dev (HTTPS + LAN)** | `bun run devhttpshost` | HTTPS + `--host`                                                         |
| **Production build**  | `bun run build`        | `tsc --noEmit`, validate config, then `vite build` → output in `dist/`   |
| **Preview (serve)**   | `bun run preview`      | Static server on port **4173** for `./dist` (needs `serve` on PATH)      |
| **Preview (Vite)**    | `bun run _preview`     | `vite preview` for the built app                                         |
| **Lint**              | `bun run lint`         | ESLint on the project                                                    |
| **Dependency graph**  | `bun run depgraph`     | Writes `graph-dependencies.html` (needs `dot`) and opens it in a browser |

## Documentation

- [project-understanding.md](project-understanding.md) — layout, layers, routing, state, config, ESLint rules
- [how-to.md](how-to.md) — features, routes, logic, localStorage, config, translations, ESLint structure
- [src/app/dict/README.md](src/app/dict/README.md) — shell translation conventions (features mirror these in their own `dict/`)
