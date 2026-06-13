// @ts-check

/**
 * ESLint independent-modules config for `eslint-plugin-project-structure`.
 *
 * Layer rules (same scope):
 * - pages → types, components, logic, dict, utils
 * - components → types, logic, dict, utils
 * - logic → types, dict, utils (no sibling logic files)
 * - dict → utils
 * - types → utils
 * - utils → types
 * - assets → assets + shared utils only
 *
 * Cross-layer rules:
 * - app → featureRegister, feature entry points, shared, config
 * - features → shared, config
 * - shared → config
 *
 * @see https://github.com/Igorkowalski94/eslint-plugin-project-structure/wiki/project%E2%80%91structure-%E2%80%8Bindependent%E2%80%91modules
 */
const _doc = "";

import { createIndependentModules } from "eslint-plugin-project-structure";

/** Top-level source folder: `src/app`, `src/features/*`, or `src/shared`. */
/** @typedef {"app" | "features" | "shared"} RootFolder */

/** Standard subfolder inside app, a feature, or shared. */
/** @typedef {"pages" | "components" | "logic" | "dict" | "types" | "utils" | "assets"} Subfolder */

/**
 * @typedef {Object} SubfolderModuleParams
 * @property {string} name ESLint module name (e.g. `AppPages`).
 * @property {string} pattern Glob matched against importing files.
 * @property {RootFolder} rootFolder Owning layer for cross-import rules and `{family}` depth.
 * @property {Subfolder} subfolder Subfolder type; drives same-scope import rules.
 */

/**
 * Imports allowed from outside the current module root.
 * Appended to same-scope imports for every subfolder except `assets`.
 * @type {Record<RootFolder, string[]>}
 */
const crossImportsByRoot = {
	app: ["src/featureRegister.tsx", "src/features/*/index.ts", "src/shared/**", "src/config/**"],
	features: ["src/shared/**", "src/config/**"],
	shared: ["src/config/**"],
};

/**
 * Same-scope import patterns per subfolder.
 * Uses `{family}` as a template replaced by {@link familyRefByRoot} at build time.
 * @example `{family}/logic/* * /` in app → `src/app/logic/* * /` at lint time
 * @example `{family}/logic/* * /` in features → `{family_3}/logic/* * /` → `src/features/counter/logic/* * /`
 * @type {Record<Subfolder, string[]>}
 */
const sameScopeImports = {
	pages: [
		"{dirname}/**",
		"{family}/types/**",
		"{family}/components/**",
		"{family}/logic/**",
		"{family}/dict/**",
		"{family}/utils/**",
	],
	components: ["{dirname}/**", "{family}/types/**", "{family}/logic/**", "{family}/dict/**", "{family}/utils/**"],
	logic: ["{family}/types/**", "{family}/dict/**", "{family}/utils/**"],
	dict: ["{dirname}/**", "{family}/utils/**"],
	types: ["{dirname}/**", "{family}/utils/**"],
	utils: ["{dirname}/**", "{family}/types/**"],
	assets: ["{family}/**", "src/shared/utils/**"],
};

/**
 * `{family}` placeholder depth per root folder (resolved at lint time by the plugin).
 *
 * `{family}` (min. 2 segments) — used for `app` and `shared`.
 * @example file `src/app/utils/foo.ts` + import `src/app/types/bar.ts` → `{family}` = `src/app`
 *
 * `{family_3}` (min. 3 segments) — used for `features` to scope to one feature.
 * @example file `src/features/counter/logic/tr.ts` + import `src/features/counter/dict/lang/en.ts` → `{family_3}` = `src/features/counter`
 * @example file `src/features/counter/logic/tr.ts` + import `src/features/timer/dict/lang/en.ts` → `{family_3}` = NO_FAMILY
 *
 * @type {Record<RootFolder, string>}
 */
const familyRefByRoot = {
	app: "{family}",
	features: "{family_3}",
	shared: "{family}",
};

/**
 * Human-readable paths used when expanding `{family}` / `{family_3}` in error messages.
 * @example `{family}/types/* * /` → `src/app/types/* * /` (app) or `src/features/ * /types/ * * /` (features)
 * @type {Record<RootFolder, string>}
 */
const familyPathByRoot = {
	app: "src/app",
	features: "src/features/*",
	shared: "src/shared",
};

/**
 * Replaces the `{family}` template in patterns with the plugin placeholder for the given root.
 * @example applyFamilyRef(["{family}/types/* * /"], "features") → ["{family_3}/types/* * /"]
 * @param {string[]} patterns
 * @param {RootFolder} rootFolder
 * @returns {string[]}
 */
const applyFamilyRef = (patterns, rootFolder) =>
	patterns.map((pattern) => pattern.replaceAll("{family}", familyRefByRoot[rootFolder]));

/**
 * Expands `{family}` / `{family_3}` for display in ESLint error messages.
 * Does not expand `{dirname}` (still resolved dynamically by the plugin per file).
 * @example expandFamily("{family_3}/types/* * /", "features") → "src/features/ * /types/ * * /"
 * @param {string} pattern
 * @param {RootFolder} rootFolder
 * @returns {string}
 */
const expandFamily = (pattern, rootFolder) => {
	const path = familyPathByRoot[rootFolder];
	return pattern.replaceAll("{family_3}", path).replaceAll("{family}", path);
};

/**
 * @param {RootFolder} rootFolder
 * @returns {string[]}
 */
const getCrossImports = (rootFolder) => crossImportsByRoot[rootFolder];

/**
 * Builds an error message listing allowed import patterns (with `{family}` expanded).
 * @param {string} name Module name shown in the error.
 * @param {string[]} allowImportsFrom Resolved allow list for the module.
 * @param {RootFolder} rootFolder Used to expand `{family}` placeholders.
 * @returns {string}
 */
const buildErrorMessage = (name, allowImportsFrom, rootFolder) =>
	`🔥 Invalid import in ${name}. Allowed: ${allowImportsFrom.map((pattern) => expandFamily(pattern, rootFolder)).join(", ")} 🔥`;

/**
 * Creates an independent-module rule for a standard subfolder under app, features, or shared.
 * Combines same-scope imports with cross-layer imports (except for `assets`).
 * @param {SubfolderModuleParams} params
 * @returns {import("eslint-plugin-project-structure").IndependentModulesConfig["modules"][number]}
 */
const createSubfolderModule = ({ name, pattern, rootFolder, subfolder }) => {
	const crossImports = crossImportsByRoot[rootFolder];
	const scopeImports = applyFamilyRef(sameScopeImports[subfolder], rootFolder);
	const allowImportsFrom = subfolder === "assets" ? scopeImports : [...scopeImports, ...crossImports];

	return {
		name,
		pattern,
		allowImportsFrom,
		errorMessage: buildErrorMessage(name, allowImportsFrom, rootFolder),
	};
};

/** @type {import("eslint-plugin-project-structure").IndependentModulesConfig} */
export const independentModulesConfig = createIndependentModules({
	// debugMode: true,
	modules: [
		{
			name: "Index",
			pattern: "src/index.tsx",
			allowImportsFrom: ["src/index.css", "src/app/App.tsx", "src/featureRegister.tsx", "src/config/bootstrap/config.tsx"],
			errorMessage: "🔥 The Index module should access index.css, App.tsx, featureRegister.tsx, and config bootstrap only. 🔥",
		},

		{
			name: "FeatureRegister",
			pattern: "src/featureRegister.tsx",
			allowImportsFrom: ["src/config/**", "src/features/*/index.ts", "src/shared/**"],
			errorMessage: "🔥 featureRegister.tsx should access config, feature entry points, and shared modules only. 🔥",
		},

		{
			name: "Config",
			pattern: "src/config/**",
			allowImportsFrom: ["src/config/**", "src/../config.jsonc"],
			allowExternalImports: true,
			errorMessage: "🔥 The Config module should access config modules and config.jsonc only. 🔥",
		},

		{
			name: "AppShell",
			pattern: ["src/app/App.tsx", "src/app/App.module.css"],
			allowImportsFrom: ["{dirname}/**", ...getCrossImports("app")],
			errorMessage: "🔥 App.tsx should access app modules, featureRegister, feature entry points, shared, and config. 🔥",
		},

		createSubfolderModule({
			name: "AppPages",
			pattern: "src/app/pages/**",
			rootFolder: "app",
			subfolder: "pages",
		}),

		createSubfolderModule({
			name: "AppComponents",
			pattern: "src/app/components/**",
			rootFolder: "app",
			subfolder: "components",
		}),

		createSubfolderModule({
			name: "AppLogic",
			pattern: "src/app/logic/**",
			rootFolder: "app",
			subfolder: "logic",
		}),

		createSubfolderModule({
			name: "AppDict",
			pattern: "src/app/dict/**",
			rootFolder: "app",
			subfolder: "dict",
		}),

		createSubfolderModule({
			name: "AppUtils",
			pattern: "src/app/utils/**",
			rootFolder: "app",
			subfolder: "utils",
		}),

		createSubfolderModule({
			name: "AppTypes",
			pattern: "src/app/types/**",
			rootFolder: "app",
			subfolder: "types",
		}),

		createSubfolderModule({
			name: "AppAssets",
			pattern: "src/app/assets/**",
			rootFolder: "app",
			subfolder: "assets",
		}),

		{
			name: "FeatureIndex",
			pattern: "src/features/*/index.ts",
			allowImportsFrom: ["{family_3}/**", ...getCrossImports("features")],
			errorMessage: buildErrorMessage("FeatureIndex", ["{family_3}/**", ...getCrossImports("features")], "features"),
		},

		createSubfolderModule({
			name: "FeaturePages",
			pattern: "src/features/*/pages/**",
			rootFolder: "features",
			subfolder: "pages",
		}),

		createSubfolderModule({
			name: "FeatureComponents",
			pattern: "src/features/*/components/**",
			rootFolder: "features",
			subfolder: "components",
		}),

		createSubfolderModule({
			name: "FeatureLogic",
			pattern: "src/features/*/logic/**",
			rootFolder: "features",
			subfolder: "logic",
		}),

		createSubfolderModule({
			name: "FeatureDict",
			pattern: "src/features/*/dict/**",
			rootFolder: "features",
			subfolder: "dict",
		}),

		createSubfolderModule({
			name: "FeatureUtils",
			pattern: "src/features/*/utils/**",
			rootFolder: "features",
			subfolder: "utils",
		}),

		createSubfolderModule({
			name: "FeatureTypes",
			pattern: "src/features/*/types/**",
			rootFolder: "features",
			subfolder: "types",
		}),

		createSubfolderModule({
			name: "FeatureAssets",
			pattern: "src/features/*/assets/**",
			rootFolder: "features",
			subfolder: "assets",
		}),

		createSubfolderModule({
			name: "SharedPages",
			pattern: "src/shared/pages/**",
			rootFolder: "shared",
			subfolder: "pages",
		}),

		createSubfolderModule({
			name: "SharedComponents",
			pattern: "src/shared/components/**",
			rootFolder: "shared",
			subfolder: "components",
		}),

		createSubfolderModule({
			name: "SharedLogic",
			pattern: "src/shared/logic/**",
			rootFolder: "shared",
			subfolder: "logic",
		}),

		createSubfolderModule({
			name: "SharedDict",
			pattern: "src/shared/dict/**",
			rootFolder: "shared",
			subfolder: "dict",
		}),

		createSubfolderModule({
			name: "SharedUtils",
			pattern: "src/shared/utils/**",
			rootFolder: "shared",
			subfolder: "utils",
		}),

		createSubfolderModule({
			name: "SharedTypes",
			pattern: "src/shared/types/**",
			rootFolder: "shared",
			subfolder: "types",
		}),

		createSubfolderModule({
			name: "SharedAssets",
			pattern: "src/shared/assets/**",
			rootFolder: "shared",
			subfolder: "assets",
		}),

		{
			name: "Tests",
			pattern: "tests/**",
			allowImportsFrom: ["**"],
		},

		{
			name: "ViteEnv",
			pattern: "src/vite-env.d.ts",
			allowImportsFrom: [],
			errorMessage: "🔥 The ViteEnv module should not import anything. 🔥",
		},

		{
			name: "_*",
			pattern: "_*/**",
			allowImportsFrom: ["**"],
			errorMessage: "🔥 The _* module should import anything. 🔥",
		},

		// All files not specified in the rules are not allowed to import anything.
		{
			name: "Unknown files",
			pattern: ["src/**"],
			allowImportsFrom: [],
			allowExternalImports: false,
			errorMessage: "🔥 This file is not specified as an independent module in `independentModules.mjs`. 🔥",
		},
	],
});
