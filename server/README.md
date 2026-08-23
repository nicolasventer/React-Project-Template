# Server

Bun + ElysiaJS + TypeBox + Drizzle ORM API. Route files map to URL paths; implementations and DAOs are wired through `src/impl.ts` and `src/dao.ts`. Shared TypeBox schemas live in `src/Shared/` (gitignored; shared with the client).

Default listen URL: `http://localhost:3000`. Swagger UI: `http://localhost:3000/swagger`.

## Prerequisites

- [Bun](https://bun.sh/)
- [TypeDoc](https://typedoc.org/) (for `bun run doc`)
- [Graphviz](https://graphviz.org/) (`dot` on your `PATH`, for `bun run depgraph`)
- Windows coverage HTML report (`bun run covhtml`):
  - [Chocolatey](https://chocolatey.org/) + [lcov](https://community.chocolatey.org/packages/lcov)
  - VS Code extension: [Coverage Gutters](https://marketplace.visualstudio.com/items?itemName=ryanluker.vscode-coverage-gutters)

## Setup

```sh
bun install
```

Mail (optional) uses Gmail OAuth2. Copy the variables below into a `.env` in this folder, then follow the setup comments in `src/mail.ts`. Mail sending is off until `B_ENABLE_MAIL_SERVICE` is set to `true` in `src/srv_config.ts`.

```
USER_EMAIL=
USER_NAME=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=
```

Database URL and JWT secret are set in `src/env.ts` (SQLite file `srv.db` by default).

## Commands

Run with `bun run <script>` from this folder.

| Script      | Description                                                      |
| ----------- | ---------------------------------------------------------------- |
| `dev`       | Start with `--watch` (`src/index.ts`)                            |
| `start`     | Start without watch                                              |
| `starttest` | Start via `src/testIndex.ts` (`testConfig.enable = true`)        |
| `test`      | Run `bun:test`                                                   |
| `cov`       | Tests with coverage                                              |
| `covhtml`   | Coverage + HTML report (`coverage/index.html`); opens the report |
| `lint`      | ESLint                                                           |
| `lintfix`   | ESLint with `--fix`                                              |
| `doc`       | TypeDoc from `*.impl.ts` files; opens `typedoc_out/index.html`   |
| `depgraph`  | Dependency Cruiser graph (`graph-dependencies.html`); opens it   |
| `push`      | `drizzle-kit push` — apply `src/drizzle/schema.ts` to SQLite     |
| `pull`      | `drizzle-kit pull` — introspect the database into `src/drizzle/` |
| `studio`    | Drizzle Studio                                                   |
| `seed`      | Seed `srv.db` (`src/drizzle.ts`)                                 |

## Architecture

Request flow: **route → impl → dao**.

| Layer     | Location                       | Role                                                                             |
| --------- | ------------------------------ | -------------------------------------------------------------------------------- |
| Routes    | `src/routes/**/*.routes.ts`    | Elysia apps. File path is the API path (`routes/api/v-1/user` → `/api/v1/users`) |
| Impl      | `src/routes/**/*.impl.ts`      | Business logic. Instantiated in `src/impl.ts`                                    |
| Dao       | `src/routes/**/*.dao.ts`       | Drizzle queries. Instantiated in `src/dao.ts`                                    |
| Schema    | `src/drizzle/schema.ts`        | SQLite tables                                                                    |
| Relations | `src/drizzle/relations.ts`     | Drizzle relations                                                                |
| Shared    | `src/Shared/`                  | TypeBox input/output schemas and `PORT` / `SRV_URL`                              |
| Plugins   | `src/elysiaPlugins.ts`         | `checkRole`, per-route `limitRate`, global `rateLimiter`                         |
| Services  | `src/jwt.ts`, `src/mail.ts`, … | JWT, mail, logging (`src/winston.ts`)                                            |

Folder and import boundaries are enforced by `folderStructure.mjs` and `independentModules.mjs`.

Typical feature files:

```ts
// user.dao.ts
export class UserDao {
	findById = async (id: number) => {
		/* drizzle */
	};
}

// user.impl.ts
export class UserImpl {
	getUser = async ({ id }: { id: number }) => dao.user.findById(id);
}

// user.routes.ts
export const userApp = new Elysia({ prefix: "/users" }).get("/:id", (req) => impl.user.getUser(req.params), {
	params: IdNumSchema,
});
```

Register new classes on `dao` / `impl`, then `.use()` the Elysia app on the parent routes file.

## API

Auth uses the `x-token` header (JWT, 1h). Roles: `superAdmin`, `admin`, `user`. `checkRole: "*"` means any authenticated user.

| Method | Path                             | Notes                                     |
| ------ | -------------------------------- | ----------------------------------------- |
| GET    | `/`                              | Health check                              |
| GET    | `/api`                           | API health check                          |
| GET    | `/api/ip`                        | Client IP                                 |
| POST   | `/api/compile`                   | TypeScript compile/execute (`superAdmin`) |
| POST   | `/api/execute`                   | Dynamic route (`src/_override.ts`)        |
| GET    | `/api/v1`                        | v1 health check                           |
| POST   | `/api/v1/auth/login`             | Login                                     |
| GET    | `/api/v1/auth/token/refresh`     | Refresh token                             |
| POST   | `/api/v1/password/request-reset` | Request reset email                       |
| PUT    | `/api/v1/password/reset`         | Reset password                            |
| POST   | `/api/v1/users`                  | Create user                               |
| GET    | `/api/v1/users`                  | List users (`admin`)                      |
| PATCH  | `/api/v1/users/:id`              | Update user (`admin`)                     |
| PATCH  | `/api/v1/users/current`          | Update self                               |
| DELETE | `/api/v1/users/:id`              | Delete user (`admin`)                     |
| DELETE | `/api/v1/users/current`          | Delete self                               |
| GET    | `/api/v1/images`                 | Images; optional `x-token` for user votes |
| POST   | `/api/v1/votes`                  | Create vote                               |
| PATCH  | `/api/v1/votes/:id`              | Update vote                               |
| DELETE | `/api/v1/votes/:id`              | Delete vote                               |

Eden types for the client are derived from `src/api.ts` (`treaty<App>`).

## Database

SQLite via Drizzle (`bun:sqlite`). Schema: `user`, `image`, `vote`.

```sh
bun run push    # apply schema
bun run seed    # demo data (admin / admin, plus generated users, images, votes)
bun run studio  # browse tables
```

The first created user becomes `admin` if none exists yet.

## Testing

Tests import `app` from `src/testIndex.ts` so `testConfig.enable` is `true` (see `src/testConfig.ts`). Call the running server with Eden from `tests/testUtils.ts`.

```sh
bun run test
```
