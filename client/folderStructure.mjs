// @ts-check

import { createFolderStructure } from "eslint-plugin-project-structure";

export const folderStructureConfig = createFolderStructure({
	structure: [
		// Allow any files in the root of your project
		{ name: "*" },
		// Allow any folders in the root of your project
		{ name: "*", children: [] },

		// src/
		{
			name: "src",
			children: [
				{ name: "index.css" },
				{ name: "index.tsx" },
				{ name: "vite-env.d.ts" },
				{ name: "featureRegister.tsx" },
				{ ruleId: "config-folder" },
				{ ruleId: "app-folder" },
				{ ruleId: "features-folder" },
				{ ruleId: "shared-folder" },
			],
		},
	],

	rules: {
		"config-folder": {
			name: "config",
			children: [{ name: "Config.ts" }, { ruleId: "config-bootstrap-folder" }],
		},
		"config-bootstrap-folder": {
			name: "bootstrap",
			children: [{ name: "config.tsx" }],
		},
		"app-folder": {
			name: "app",
			children: [
				{ name: "App.tsx" },
				{ name: "App.module.css" },
				{ ruleId: "assets-folder" },
				{ ruleId: "components-folder" },
				{ ruleId: "dict-folder" },
				{ ruleId: "logic-folder" },
				{ ruleId: "pages-folder" },
				{ ruleId: "utils-folder" },
				{ ruleId: "types-folder" },
			],
		},
		"features-folder": {
			name: "features",
			children: [{ ruleId: "feature-folder" }],
		},
		"feature-folder": {
			name: "{camelCase}",
			children: [
				{ name: "index.ts" },
				{ ruleId: "assets-folder" },
				{ ruleId: "components-folder" },
				{ ruleId: "dict-folder" },
				{ ruleId: "logic-folder" },
				{ ruleId: "pages-folder" },
				{ ruleId: "utils-folder" },
				{ ruleId: "types-folder" },
			],
		},
		"shared-folder": {
			name: "shared",
			children: [
				{ ruleId: "assets-folder" },
				{ ruleId: "components-folder" },
				{ ruleId: "dict-folder" },
				{ ruleId: "logic-folder" },
				{ ruleId: "pages-folder" },
				{ ruleId: "utils-folder" },
				{ ruleId: "types-folder" },
			],
		},
		"components-folder": {
			name: "components",
			children: [{ name: "{PascalCase}.tsx" }, { name: "{PascalCase}.module.css" }],
		},
		"dict-folder": {
			name: "dict",
			children: [{ name: "index.ts" }, { name: "README.md" }, { name: "lang", children: [{ name: "{snake_case}.ts" }] }],
		},
		"logic-folder": {
			name: "logic",
			children: [{ name: "{camelCase}.ts" }],
		},
		"pages-folder": {
			name: "pages",
			children: [{ name: "{PascalCase}.tsx" }, { name: "{PascalCase}.module.css" }],
		},
		"types-folder": {
			name: "types",
			children: [{ name: "{PascalCase}.type.ts" }, { name: "{PascalCase}.ts" }],
		},
		"utils-folder": {
			name: "utils",
			children: [],
		},
		"assets-folder": {
			name: "assets",
			children: [
				{ name: "*.(ts|tsx)" },
				{ ruleId: "images-folder" },
				{ ruleId: "videos-folder" },
				{ ruleId: "audios-folder" },
				{ ruleId: "data-folder" },
				{ ruleId: "fonts-subfolder", children: [{ name: "font.css" }] },
				{ ruleId: "markdown-folder" },
				{ ruleId: "other-folder" },
				{ name: "*", ruleId: "assets-folder" },
			],
		},
		"images-folder": {
			name: "images",
			children: [
				{ name: "*.(ts|tsx)" },
				{ name: "*.(png|jpg|jpeg|gif|svg|ico)" },
				{ name: "*", ruleId: "images-folder" },
			],
		},
		"videos-folder": {
			name: "videos",
			children: [
				{ name: "*.(ts|tsx)" },
				{ name: "*.(mp4|webm|ogg|mkv)" },
				{ name: "*", ruleId: "videos-folder" },
			],
		},
		"audios-folder": {
			name: "audios",
			children: [
				{ name: "*.(ts|tsx)" },
				{ name: "*.(mp3|wav|ogg)" },
				{ name: "*", ruleId: "audios-folder" },
			],
		},
		"data-folder": {
			name: "data",
			children: [{ name: "*.(ts|tsx)" }, { name: "*.json" }, { name: "*", ruleId: "data-folder" }],
		},
		"fonts-subfolder": {
			name: "fonts",
			children: [
				{ name: "*.(ts|tsx)" },
				{ name: "*.(eot|ttf|woff|woff2)" },
				{ name: "*", ruleId: "fonts-subfolder" },
			],
		},
		"markdown-folder": {
			name: "markdown",
			children: [{ name: "*.(ts|tsx)" }, { name: "*.(md|mdx)" }, { name: "*", ruleId: "markdown-folder" }],
		},
		"other-folder": {
			name: "other",
			children: [{ name: "*.(ts|tsx)" }, { name: "*" }, { name: "*", ruleId: "other-folder" }],
		},
	},
});
