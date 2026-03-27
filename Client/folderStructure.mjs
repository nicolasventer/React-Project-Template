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
				// src/globalRef.ts
				{ name: "globalRef.ts" },
				// src/index.css
				{ name: "index.css" },
				// src/index.tsx
				{ name: "index.tsx" },
				// src/localStorage.ts
				{ name: "localStorage.ts" },
				// src/routerInstance.gen.ts
				{ name: "routerInstance.gen.ts" },
				// src/vite-env.d.ts
				{ name: "vite-env.d.ts" },
				// src/api/
				{ name: "api", children: [{ name: "api.ts" }, { name: "api.(config|gen|mock).ts" }] },
				// src/assets/
				{ ruleId: "assets-folder" },
				// src/components/
				{ ruleId: "components-folder" },
				// src/config/
				{ name: "config", children: [{ name: "cliConfig.ts" }, { name: "srvConfig.ts" }] },
				// src/dict/
				{ name: "dict", children: [{ name: "index.ts" }, { name: "lang", children: [{ name: "{snake_case}.ts" }] }] },
				// src/logic/
				{ ruleId: "logic-folder" },
				// src/pages/
				{ ruleId: "pages-folder" },
				// src/types/
				{ name: "types", children: [{ name: "{PascalCase}.type.ts" }] },
				// src/routes/
				{ ruleId: "routes-folder" },
				// src/utils/
				{ name: "utils", children: [] },
			],
		},
	],

	rules: {
		"components-folder": {
			name: "components",
			children: [
				{ name: "_?{camelCase}", ruleId: "components-folder" },
				{ name: "{PascalCase}(.lazy)?.tsx" },
				{ name: "{PascalCase}.css" },
				{ name: "{camelCase}(.lazy)?.ts" },
			],
		},
		"routes-folder": {
			name: "routes",
			children: [{ name: "*.tsx" }, { name: "*.css" }, { name: "*", ruleId: "routes-folder" }],
		},
		"logic-folder": {
			name: "logic",
			children: [{ name: "{camelCase}.ts" }, { name: "{camelCase}", ruleId: "logic-folder" }],
		},
		"pages-folder": {
			name: "pages",
			children: [
				{ name: "{camelCase}", ruleId: "pages-folder" },
				{ name: "{PascalCase}(.lazy)?.tsx" },
				{ name: "{PascalCase}.css" },
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
