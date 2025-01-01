# Preact Project Template

This is a template for a opinionated Preact project with many features already set up.  
There are 4 links, each link corresponding to `Preact`/`React` `Full`/`Light` Template.

| ![full_screenshot](./misc/full_screenshot.jpeg) | ![light_screenshot](./misc/light_screenshot.jpeg) |
| :---------------------------------------------: | :-----------------------------------------------: |
|                      Full                       |                       Light                       |

### [Try it online](https://nicolasventer.github.io/Preact-Project-Template/)

**Note:** `memo` is not used in React version.

**Note 2:** It is expected in the future that **_all Preact versions will be deleted_** since memoization is handled by React with its compiler.

The `Light versions` remove the dependencies with `typebox`, `mantine`, `react-hot-toast`, `lucide-react` and `react-icons`.

## Links

- [Preact Full Template](https://github.com/nicolasventer/Preact-Project-Template/tree/preact/full)
- [Preact Light Template](https://github.com/nicolasventer/Preact-Project-Template/tree/preact/light)
- [React Full Template](https://github.com/nicolasventer/Preact-Project-Template/tree/react/full)
- [React Light Template](https://github.com/nicolasventer/Preact-Project-Template/tree/react/light)

## Features

- [x] File base routing (client) (using [Easy-React-Router](https://github.com/nicolasventer/Easy-React-Router))
- [x] Lazy loading (client) (using [Easy-React-Router](https://github.com/nicolasventer/Easy-React-Router))
- [x] Structured code (client) (see [Client project structure](Client/README.md#project-structure))
- [x] Tests (server and client)
- [x] Code coverage (server and client)
- [x] Documentation (server and client) _(WIP: change of doc tool)_
- [x] Dependency graph (client)
- [x] Linting (server and client)

## Installation

### Requirements

```sh
npm install -g bun
npm install -g serve
```

### On Windows:

#### Installation

```bat
git clone https://github.com/nicolasventer/Preact-Project-Template
cd Preact-Project-Template
all_init_on_cloned.bat
```

The script will create a symbolic link between the `Shared` folder of the `Client` and `Server` folders and then install the dependencies.  
If you want to install the dependencies manually, you should at least create the symbolic link:

```bat
mk_link.bat
```

If you only require the server, you can run the following:

```bat
copy_shared.bat
```

### On Linux

#### Installation

```sh
git clone https://github.com/nicolasventer/Preact-Project-Template.git
cd Preact-Project-Template
./all_init_on_cloned.sh
```

The script will create a symbolic link between the `Shared` folder of the `Client` and `Server` folders and then install the dependencies.  
If you want to install the dependencies manually, you should at least create the symbolic link:

```sh
mk_link.sh
```

If you only require the server, you can run the following:

```sh
copy_shared.sh
```

## Usage

### Client

#### Development

##### Watch mode

In the Client folder:

```sh
bun run dev
```

**WARNING:** Be sure to be exactly in the Client folder, otherwise you will have page not found error.

_Access the client at http://localhost:5173_

##### Preview mode

In the Client folder, run:

```sh
bun run build
bun run preview
```

_Access the client at http://localhost:4173_

#### Production

##### Preview mode

In the Client folder, run:

```sh
bun run buildProd
bun run previewProd
```

_Access the client at http://localhost:4173/${clientEnv.BASE_URL}/_

#### Deployment

In the Client folder, run:

```sh
bun run buildDeploy
```

It updates the `docs` folder (for example for GitHub pages).

### Server

#### Development

##### Watch mode

In the Server folder, run:

```sh
bun run dev
```

##### Preview mode

In the Server folder, run:

```sh
bun run start
```

_Check that the server is running at http://localhost:3000/_

#### Production

TODO: see for building the server.

#### Deployment

TODO: see for deploying the server.

---

## Project structure

![project_structure](misc/d2/project_structure.png)

## Tech stack

![tech_stack](misc/d2/tech_stack.png)
