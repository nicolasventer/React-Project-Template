# Server

This is the server side of the application.

# Development

## Requirements

- [bun](https://bun.sh/)
- [typedoc](https://typedoc.org/)
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

## Lint

Get the linting report with:

```sh
bun run lint
```

Fix the linting issues with:

```sh
bun run lintfix
```
