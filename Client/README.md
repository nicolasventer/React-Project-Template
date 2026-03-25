# React + TypeScript + Vite (template)

Opinionated React 19 + Vite 8 + TypeScript starter with ESLint (folder structure and module boundaries), i18n, and a single `app` façade from `@/logic`. See [project-understanding.md](project-understanding.md) for architecture and [how-to.md](how-to.md) for common tasks.

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

| Script                | Command                | Description                                                                                                                   |
| --------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Dev server**        | `bun run dev`          | Start Vite dev server (default URL in terminal)                                                                               |
| **Dev (LAN)**         | `bun run devhost`      | Dev server bound to all interfaces (`bunx --bun vite --host`)                                                                 |
| **Dev (HTTPS)**       | `bun run devhttps`     | Dev server with HTTPS (`USE_HTTPS=true`, uses `npx vite`)                                                                     |
| **Dev (HTTPS + LAN)** | `bun run devhttpshost` | HTTPS + `--host`                                                                                                              |
| **Production build**  | `bun run build`        | `tsc -b` then `vite build` → output in `dist/`                                                                                |
| **Preview (serve)**   | `bun run preview`      | Static server on port **4173** for `./dist` (needs `serve` on PATH)                                                           |
| **Preview (Vite)**    | `bun run _preview`     | `vite preview` for the built app                                                                                              |
| **Lint**              | `bun run lint`         | ESLint on the project                                                                                                         |
| **Dependency graph**  | `bun run depgraph`     | Writes `graph-dependencies.html` (needs `dot`). On Windows the script opens the file; elsewhere open it in a browser manually |

## Documentation

- [project-understanding.md](project-understanding.md) — layout, stack, routing, `app`, ESLint rules
- [how-to.md](how-to.md) — routes, logic, localStorage, config, translations, ESLint structure
