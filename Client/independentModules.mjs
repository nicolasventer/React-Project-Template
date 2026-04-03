// @ts-check

import { createIndependentModules } from "eslint-plugin-project-structure";

export const independentModulesConfig = createIndependentModules({
	// debugMode: true,
	modules: [
		{
			name: "Index",
			pattern: "src/index.tsx",
			allowImportsFrom: ["{global}", "src/index.css", "src/pages/**", "src/routes/**"],
			errorMessage: "🔥 The Index module should access to global, Pages and Routes modules. 🔥",
		},

		{
			name: "Pages",
			pattern: "src/pages/**",
			allowImportsFrom: ["src/pages/**", "src/components/**", "{readWriteStates}"],
			errorMessage: "🔥 The Pages module should access to Pages, Components and readWriteStates modules. 🔥",
		},

		{
			name: "Routes",
			pattern: "src/routes/**",
			allowImportsFrom: ["src/routes/**", "src/components/**", "{readWriteStates}", "src/routerInstance.gen.ts"],
			errorMessage:
				"🔥 The Routes module should access to Routes, Components, readWriteStates and routerInstance.gen.ts modules. 🔥",
		},

		{
			name: "RouterInstance",
			pattern: "src/routerInstance.gen.ts",
			allowImportsFrom: ["src/routes/**"],
			errorMessage: "🔥 The RouterInstance module should access to Routes module only. 🔥",
		},

		{
			name: "Components",
			pattern: "src/components/**",
			allowImportsFrom: ["src/components/_*/**", "{dirname}/**", "{readWriteStates}", "src/routerInstance.gen.ts"],
			errorMessage:
				"🔥 The Components module should access to its subfolders, all common components, readWriteStates and routerInstance.gen.ts modules. 🔥",
		},

		{
			name: "Assets",
			pattern: "src/assets/**",
			allowImportsFrom: ["src/assets/**"],
			errorMessage: "🔥 The Assets module should access to Assets module only. 🔥",
		},

		{
			name: "logic/index.ts",
			pattern: "src/logic/index.ts",
			allowImportsFrom: ["src/logic/**", "src/localStorage.ts"],
			errorMessage: "🔥 The logic/index.ts module should access to Logic and LocalStorage modules only. 🔥",
		},

		{
			name: "Api",
			pattern: "src/api/**",
			allowImportsFrom: ["src/api/**", "{global}"],
			errorMessage: "🔥 The Api module should access to Api and global modules. 🔥",
		},

		{
			name: "Logic",
			pattern: "src/logic/**",
			allowImportsFrom: ["{global}", "src/localStorage.ts", "src/api/api.ts", "src/routerInstance.gen.ts"],
			errorMessage:
				"🔥 The Logic module should access to Logic, global, LocalStorage, api.ts and routerInstance.gen.ts modules. 🔥",
		},

		{
			name: "LocalStorage",
			pattern: ["src/localStorage.ts"],
			allowImportsFrom: ["{global}"],
			errorMessage: "🔥 The LocalStorage module should access to global module only. 🔥",
		},

		{
			name: "Config",
			pattern: "src/config/**",
			allowImportsFrom: ["{global}"],
			errorMessage: "🔥 The Config module should access to global module only. 🔥",
		},

		{
			name: "Dict",
			pattern: "src/dict/**",
			allowImportsFrom: ["src/dict/**"],
			errorMessage: "🔥 The Dict module should access to Dict module only. 🔥",
		},

		{
			name: "Utils",
			pattern: "src/utils/**",
			allowImportsFrom: ["src/utils/**"],
			errorMessage: "🔥 The Utils module should access to Utils module only. 🔥",
		},

		{
			name: "Types",
			pattern: "src/types/**",
			allowImportsFrom: ["src/types/**"],
			errorMessage: "🔥 The Types module should access to Types module only. 🔥",
		},

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
		global: ["src/config/**", "src/dict/**", "src/types/**", "src/utils/**"],
		readWriteStates: ["{global}", "src/assets/**", "src/logic/index.ts", "src/api/api.ts"],
	},
});
