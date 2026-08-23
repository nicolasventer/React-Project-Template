# React Project Template

Starter templates for a React client and a Bun API. They live in the same repository for convenience; **they are not related**. There is no shared package, no generated API client, and neither app depends on the other. Run, develop, and use them independently.

| Directory | Stack | Docs |
| --------- | ----- | ---- |
| [`client/`](client/) | React 19, Vite, TypeScript | [client/README.md](client/README.md) |
| [`server/`](server/) | Bun, ElysiaJS, TypeBox, Drizzle ORM | [server/README.md](server/README.md) |

Each directory has its own `package.json`, lockfile, ESLint config, and scripts. There is no workspace root and no combined install.

## Client

Opinionated React 19 + Vite 8 + TypeScript SPA: feature-based layout, config-driven feature flags, custom router and store, per-surface i18n.

```bash
cd client
bun install
bun run dev
```

Use `npm`, `pnpm`, or `yarn` instead of Bun if you prefer. Architecture and how-tos: [client/project-understanding.md](client/project-understanding.md), [client/how-to.md](client/how-to.md).

## Server

Bun + ElysiaJS API with TypeBox validation and Drizzle on SQLite. Routes map to URL paths; business logic and queries sit in `*.impl.ts` / `*.dao.ts`. Default listen URL: `http://localhost:3000`. Swagger: `http://localhost:3000/swagger`.

```bash
cd server
bun install
bun run dev
```

Bun is required for the server. Database, mail, tests, and the route list are documented in [server/README.md](server/README.md).
