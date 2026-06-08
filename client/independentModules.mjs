// @ts-check

import { createIndependentModules } from "eslint-plugin-project-structure";

export const independentModulesConfig = createIndependentModules({
	// debugMode: true,
	modules: [
		{
			name: "Index",
			pattern: "src/index.tsx",
			allowImportsFrom: ["src/index.css", "src/bootstrap/**", "src/app/**"],
			errorMessage: "🔥 The Index module should access bootstrap, app shell, and global styles only. 🔥",
		},

		{
			name: "Bootstrap",
			pattern: "src/bootstrap/**",
			allowImportsFrom: ["{shared}", "config.jsonc", "src/../config.jsonc"],
			allowExternalImports: true,
			errorMessage: "🔥 The Bootstrap module should access shared modules and config.jsonc only. 🔥",
		},

		{
			name: "AppShell",
			pattern: ["src/app/App.tsx", "src/app/featureRegister.tsx"],
			allowImportsFrom: ["src/app/**", "src/features/**", "src/bootstrap/**", "{shared}"],
			errorMessage:
				"🔥 The App shell should access app, features, bootstrap config, and shared modules. 🔥",
		},

		{
			name: "AppComponents",
			pattern: "src/app/components/**",
			allowImportsFrom: ["{dirname}/**", "src/app/dict/**", "src/app/logic/**", "{shared}"],
			errorMessage:
				"🔥 App components should access their folder, app dict/logic, and shared modules. 🔥",
		},

		{
			name: "AppPages",
			pattern: "src/app/pages/**",
			allowImportsFrom: ["src/app/pages/**", "src/app/logic/**", "{shared}"],
			errorMessage: "🔥 App pages should access pages, app logic, and shared modules. 🔥",
		},

		{
			name: "AppLogic",
			pattern: "src/app/logic/**",
			allowImportsFrom: [
				"{shared}",
				"src/app/types/**",
				"src/app/dict/**",
				"src/app/featureRegister.tsx",
			],
			errorMessage:
				"🔥 App logic modules are independent: shared, app types/dict, and featureRegister only — not sibling logic files. 🔥",
		},

		{
			name: "AppDict",
			pattern: "src/app/dict/**",
			allowImportsFrom: ["src/app/dict/**", "{shared}/types/**"],
			errorMessage: "🔥 The App dict module should access app dict and shared types only. 🔥",
		},

		{
			name: "AppTypes",
			pattern: "src/app/types/**",
			allowImportsFrom: ["src/app/types/**"],
			errorMessage: "🔥 App types should access app types only. 🔥",
		},

		{
			name: "AppAssets",
			pattern: "src/app/assets/**",
			allowImportsFrom: ["src/app/assets/**"],
			errorMessage: "🔥 App assets should access app assets only. 🔥",
		},

		{
			name: "FeatureIndex",
			pattern: "src/features/*/index.ts",
			allowImportsFrom: ["{dirname}/**", "{shared}"],
			errorMessage: "🔥 Feature index should access the same feature and shared modules. 🔥",
		},

		{
			name: "FeatureComponents",
			pattern: "src/features/*/components/**",
			allowImportsFrom: [
				"{dirname}/**",
				"src/features/*/components/**",
				"src/features/*/logic/**",
				"src/features/*/dict/**",
				"src/bootstrap/**",
				"{shared}",
			],
			errorMessage:
				"🔥 Feature components should access the same feature, bootstrap config, and shared modules. 🔥",
		},

		{
			name: "FeatureLogic",
			pattern: "src/features/*/logic/**",
			allowImportsFrom: ["src/features/*/dict/**", "{shared}"],
			errorMessage:
				"🔥 Feature logic modules are independent: same-feature dict and shared only — not sibling logic or app. 🔥",
		},

		{
			name: "FeatureDict",
			pattern: "src/features/*/dict/**",
			allowImportsFrom: ["{dirname}/**", "{shared}/types/**"],
			errorMessage: "🔥 Feature dict should access the same feature dict and shared types only. 🔥",
		},

		{
			name: "Shared",
			pattern: "src/shared/**",
			allowImportsFrom: ["src/shared/**"],
			errorMessage: "🔥 The Shared module should access shared modules only. 🔥",
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
	reusableImportPatterns: {
		shared: ["src/shared/**"],
	},
});
