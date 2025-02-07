// @ts-check

import js from "@eslint/js";
import noRelativeImportPlugin from "eslint-plugin-no-relative-import-paths";
import { projectStructureParser, projectStructurePlugin } from "eslint-plugin-project-structure";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";
import { folderStructureConfig } from "./folderStructure.mjs";
import { independentModulesConfig } from "./independentModules.mjs";

export default tseslint.config(
	{ ignores: ["dist", "*.tgz", "src/Shared"] },
	{
		files: ["**"],
		ignores: ["bun.lockb", "projectStructure.cache.json"],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
			parser: projectStructureParser,
		},
		plugins: {
			"project-structure": projectStructurePlugin,
		},
		rules: {
			"project-structure/folder-structure": ["error", folderStructureConfig],
			"project-structure/independent-modules": ["error", independentModulesConfig],
		},
	},
	{
		extends: [js.configs.recommended, ...tseslint.configs.recommended],
		files: ["**/*.{ts,tsx}"],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
		},
		plugins: {
			// @ts-expect-error invalid type for reactHooks
			"react-hooks": reactHooks,
			"react-refresh": reactRefresh,
			"no-relative-import-paths": noRelativeImportPlugin,
			react,
		},
		rules: {
			"react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
			"no-relative-import-paths/no-relative-import-paths": ["error", { allowSameFolder: true }],
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
					caughtErrorsIgnorePattern: "^_",
				},
			],
			"no-useless-constructor": "off",
			"@typescript-eslint/no-useless-constructor": "error",
			"jest/no-done-callback": "off",
			"react/jsx-key": "warn",
			"react/no-array-index-key": "warn",
			"react/react-in-jsx-scope": "off",
			"react/prop-types": "off",
			"react-hooks/rules-of-hooks": "error",
			"react-hooks/exhaustive-deps": "warn",
			"@typescript-eslint/no-namespace": "off",
			"@typescript-eslint/consistent-type-imports": "warn",
		},
	}
);
