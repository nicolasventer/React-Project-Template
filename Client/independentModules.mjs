// @ts-check

import { createIndependentModules } from "eslint-plugin-project-structure";

export const independentModulesConfig = createIndependentModules({
	// debugMode: true,
	modules: [
		{
			name: "Root",
			pattern: ["src/*", "src/api/*", "src/tr/*", "*"],
			allowImportsFrom: ["{root}", "src/utils/**", "src/routes/**", "src/Shared/**", "{misc}", "{externalLibs}"],
			errorMessage: "🔥 The Root module should access to Root, Utils, Routes and Shared modules. 🔥",
		},

		{
			name: "Utils",
			pattern: "src/utils/**",
			allowImportsFrom: ["src/utils/**", "{externalLibs}"],
			errorMessage: "🔥 The Utils module should access to Utils modules only. 🔥",
		},

		{
			name: "Shared",
			pattern: "src/Shared/**",
			allowImportsFrom: ["src/Shared/**", "{externalLibs}"],
			errorMessage: "🔥 The Shared module should access to Shared modules only. 🔥",
		},

		{
			name: "Routes",
			pattern: "src/routes/**",
			allowImportsFrom: ["src/routes/**", "src/components/**", "{readWriteGlobalState}"],
			errorMessage: "🔥 The Routes module should access to Routes and Components modules and readWriteGlobalState imports. 🔥",
		},

		{
			name: "ActionsImpl",
			pattern: "src/actions/actions.impl.ts",
			allowImportsFrom: ["src/actions/**"],
			errorMessage: "🔥 The ActionsImpl module should access to Actions module. 🔥",
		},

		{
			name: "Actions",
			pattern: "src/actions/**",
			allowImportsFrom: ["src/actions/**", "{readWriteGlobalState}", "src/api/api.ts"],
			errorMessage: "🔥 The Actions module should access to Actions module, readWriteGlobalState imports and api.ts. 🔥",
		},

		{
			name: "Components",
			pattern: "src/components/**",
			allowImportsFrom: ["src/components/_*/**", "{dirname}/**", "{readWriteGlobalState}"],
			errorMessage:
				"🔥 The Components module should access to its subfolders, all common components and readWriteGlobalState imports. 🔥",
		},

		{
			name: "Tests",
			pattern: "tests/**",
			allowImportsFrom: ["**"],
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
	reusableImportPatterns: {
		misc: ["src/assets/**"],
		root: ["src/*", "src/api/*", "src/tr/*", "*"],
		readWriteGlobalState: [
			"src/dict.ts",
			"src/tr/en.ts",
			"src/globalState.ts",
			"src/actions/actions.impl.ts",
			"src/*.gen.ts",
			"src/utils/**",
			"src/Shared/**",
			"{misc}",
			"{externalLibs}",
		],
		externalLibs: [],
	},
});
