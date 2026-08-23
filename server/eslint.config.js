// @ts-check

import js from "@eslint/js";
import { projectStructureParser, projectStructurePlugin } from "eslint-plugin-project-structure";
import globals from "globals";
import tseslint from "typescript-eslint";
import { folderStructureConfig } from "./folderStructure.mjs";
import { independentModulesConfig } from "./independentModules.mjs";

export default tseslint.config(
	{
		files: ["**"],
		ignores: ["bun.lockb", "projectStructure.cache.json"],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.node,
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
		files: ["**/*.ts"],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.node,
		},
		rules: {
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
			"@typescript-eslint/no-namespace": "off",
			"@typescript-eslint/consistent-type-imports": "warn",
		},
	}
);
