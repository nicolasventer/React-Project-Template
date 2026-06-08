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
				{ ruleId: "bootstrap-folder" },
				{ ruleId: "app-folder" },
				{ ruleId: "features-folder" },
				{ ruleId: "shared-folder" },
			],
		},
	],

	rules: {
		"bootstrap-folder": {
			name: "bootstrap",
			children: [{ name: "config.tsx" }],
		},
		"app-folder": {
			name: "app",
			children: [
				{ name: "App.tsx" },
				{ name: "App.module.css" },
				{ name: "featureRegister.tsx" },
				{ ruleId: "assets-folder" },
				{ ruleId: "app-components-folder" },
				{ ruleId: "app-dict-folder" },
				{ ruleId: "app-logic-folder" },
				{ ruleId: "app-pages-folder" },
				{ name: "types", children: [{ name: "{PascalCase}.type.ts" }] },
			],
		},
		"app-components-folder": {
			name: "components",
			children: [{ name: "{PascalCase}.tsx" }, { name: "{PascalCase}.module.css" }],
		},
		"app-dict-folder": {
			name: "dict",
			children: [
				{ name: "index.ts" },
				{ name: "README.md" },
				{ name: "lang", children: [{ name: "{snake_case}.ts" }] },
			],
		},
		"app-logic-folder": {
			name: "logic",
			children: [{ name: "{camelCase}.ts" }],
		},
		"app-pages-folder": {
			name: "pages",
			children: [{ name: "{PascalCase}.tsx" }, { name: "{PascalCase}.module.css" }],
		},
		"features-folder": {
			name: "features",
			children: [{ ruleId: "feature-folder" }],
		},
		"feature-folder": {
			name: "{camelCase}",
			children: [
				{ name: "index.ts" },
				{ ruleId: "feature-components-folder" },
				{ ruleId: "feature-dict-folder" },
				{ ruleId: "feature-logic-folder" },
			],
		},
		"feature-components-folder": {
			name: "components",
			children: [{ name: "{PascalCase}.tsx" }, { name: "{PascalCase}.module.css" }],
		},
		"feature-dict-folder": {
			name: "dict",
			children: [{ name: "index.ts" }, { name: "lang", children: [{ name: "{snake_case}.ts" }] }],
		},
		"feature-logic-folder": {
			name: "logic",
			children: [{ name: "{camelCase}.ts" }],
		},
		"shared-folder": {
			name: "shared",
			children: [
				{ name: "Config.ts" },
				{ ruleId: "shared-logic-folder" },
				{ name: "types", children: [{ name: "{PascalCase}.ts" }] },
				{ ruleId: "shared-utils-folder" },
			],
		},
		"shared-logic-folder": {
			name: "logic",
			children: [{ name: "{camelCase}.ts" }],
		},
		"shared-utils-folder": {
			name: "utils",
			children: [
				{ name: "*.tsx" },
				{ name: "*.ts" },
				{ name: "hooks", children: [{ name: "*.ts" }] },
			],
		},
		"assets-folder": {
			name: "assets",
			children: [
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
			children: [{ name: "*.(png|jpg|jpeg|gif|svg|ico)" }, { name: "*", ruleId: "images-folder" }],
		},
		"videos-folder": {
			name: "videos",
			children: [{ name: "*.(mp4|webm|ogg|mkv)" }, { name: "*", ruleId: "videos-folder" }],
		},
		"audios-folder": {
			name: "audios",
			children: [{ name: "*.(mp3|wav|ogg)" }, { name: "*", ruleId: "audios-folder" }],
		},
		"data-folder": {
			name: "data",
			children: [{ name: "*.json" }, { name: "*", ruleId: "data-folder" }],
		},
		"fonts-subfolder": {
			name: "fonts",
			children: [{ name: "*.(eot|ttf|woff|woff2)" }, { name: "*", ruleId: "fonts-subfolder" }],
		},
		"markdown-folder": {
			name: "markdown",
			children: [{ name: "*.(md|mdx)" }, { name: "*", ruleId: "markdown-folder" }],
		},
		"other-folder": {
			name: "other",
			children: [{ name: "*" }, { name: "*", ruleId: "other-folder" }],
		},
	},
});
