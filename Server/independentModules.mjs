import { createIndependentModules } from "eslint-plugin-project-structure";

export const independentModulesConfig = createIndependentModules({
	modules: [
		{
			name: "Drizzle",
			pattern: ["src/drizzle.ts", "src/drizzle/**", "src/env.ts"],
			allowImportsFrom: ["src/drizzle/**"],
			errorMessage: "🔥 The Drizzle module should access to Drizzle modules only. 🔥",
		},

		{
			name: "Root",
			pattern: ["src/*", "*"],
			allowImportsFrom: ["{root}", "src/utils/**", "src/routes/**", "src/Shared/**", "{misc}", "{toOrganize}"],
			errorMessage: "🔥 The Root module should access to Root, Utils, Routes and Shared modules. 🔥",
		},

		{
			name: "Utils",
			pattern: "src/utils/**",
			allowImportsFrom: ["src/utils/**"],
			errorMessage: "🔥 The Utils module should access to Utils modules only. 🔥",
		},

		{
			name: "ToOrganize",
			pattern: "src/toOrganize/**",
			allowImportsFrom: ["**"],
			errorMessage: "🔥 The ToOrganize module should access to everything. 🔥",
		},

		{
			name: "Shared",
			pattern: "src/Shared/**",
			allowImportsFrom: ["src/Shared/**"],
			errorMessage: "🔥 The Shared module should access to Shared modules only. 🔥",
		},

		{
			name: "Routes",
			pattern: "src/routes/**",
			allowImportsFrom: ["src/Shared/**", "src/utils/**", "src/impl.ts", "src/drizzle.ts", "{misc}", "{dirname}/**"],
			errorMessage: "🔥 The Routes module should only access Shared modules, Utils and Route folder and subfolders. 🔥",
		},

		{
			name: "Tests",
			pattern: "tests/**",
			allowImportsFrom: ["**"],
		},

		// All files not specified in the rules are not allowed to import anything
		{
			name: "Unknown files",
			pattern: [["**", "!src/*"]],
			allowImportsFrom: [],
			allowExternalImports: false,
			errorMessage: "🔥 This file is not specified as an independent module in `independentModules.mjs`. 🔥",
		},
	],
	reusableImportPatterns: {
		misc: ["src/assets/**"],
		root: ["src/*"],
		toOrganize: ["src/toOrganize/**"],
	},
});
