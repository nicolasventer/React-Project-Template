import { createIndependentModules } from "eslint-plugin-project-structure";

export const independentModulesConfig = createIndependentModules({
	modules: [
		{
			name: "Root",
			pattern: ["src/*", "*"],
			allowImportsFrom: ["{root}", "src/routes/**", "src/Shared/**", "{misc}", "{toOrganize}"],
			errorMessage: "🔥 The Root module should access to Root, Routes and Shared modules. 🔥",
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
			allowImportsFrom: ["src/Shared/**", "{misc}", "{dirname}/**"],
			errorMessage: "🔥 The Routes module should only access Shared modules and Route folder and subfolders. 🔥",
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
