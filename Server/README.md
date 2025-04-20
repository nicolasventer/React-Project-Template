# Server

This is the server side of the application.

# Development

## Requirements

- [bun](https://bun.sh/)
- [chocolatey](https://chocolatey.org/)
  - [lcov](https://community.chocolatey.org/packages/lcov)
- VSCode extension: [Coverage Gutter](https://marketplace.visualstudio.com/items?itemName=ryanluker.vscode-coverage-gutters)

## Installation

```sh
bun install
```

## Run

```sh
bun run dev
```

## Launch

```sh
bun run start
```

## Test

For behavior specific to tests, use the variable `testConfig.enable` defined in `src/testConfig.ts`.

Execute tests with:

```sh
bun run test
```

Execute tests coverage with:

```sh
bun run cov
```

Execute tests coverage and open the report with:

```sh
bun run covhtml
```

## Documentation

```sh
bun run doc
```

## Dependency graph

```sh
bun run depgraph
```

You can visually check that the [Project structure](#project-structure) is respected.

## Lint

Get the linting report with:

```sh
bun run lint
```

Fix the linting issues with:

```sh
bun run lintfix
```

# Project structure

![server_project_structure](./misc/d2/server_project_structure.png)

- Folder `toOrganize` should be deleted, for now it can contains folders like `database`.
