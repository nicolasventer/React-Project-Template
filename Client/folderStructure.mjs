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
				// src/clientEnv.ts
				{ name: "clientEnv.ts" },
				// src/globalState.ts
				{ name: "globalState.ts" },
				// src/gs.ts
				{ name: "gs.ts" },
				// src/index.css
				{ name: "index.css" },
				// src/index.tsx
				{ name: "index.tsx" },
				// src/vite-env.d.ts
				{ name: "vite-env.d.ts" },
				// src/*.gen.ts
				{ name: "*.gen.ts" },
				// src/api/
				{ name: "api", children: [{ name: "api.ts" }, { name: "api.(config|gen|mock).ts" }] },
				// src/assets/
				{ ruleId: "assets-folder" },
				// src/utils/
				{ name: "utils", children: [] },
				// src/routes/
				{ ruleId: "routes-folder" },
				// src/tr/
				{ name: "tr", children: [{ name: "{snake_case}.(ts|js)" }] },
				// src/actions/
				{
					name: "actions",
					children: [
						{ name: "actions.(impl|interface|state|types|utils).ts" },
						{ name: "_*.ts" },
						{ ruleId: "actions-subfolder" },
					],
				},
				// src/components/
				{ ruleId: "components-folder" },
				// src/Shared/
				{ name: "Shared", children: [] },
			],
		},
	],

	rules: {
		"components-folder": {
			name: "components",
			children: [
				{ name: "_?{camelCase}", ruleId: "components-folder" },
				{ name: "{PascalCase}(.lazy)?.tsx" },
				{ name: "{PascalCase}.(utils|props|imports).ts" },
				{ name: "{PascalCase}.module.css" },
			],
		},
		"routes-folder": {
			name: "routes",
			children: [{ name: "*.tsx" }, { name: "*", ruleId: "routes-folder" }],
		},
		"assets-folder": {
			name: "assets",
			children: [
				{ ruleId: "images-folder" },
				{ ruleId: "videos-folder" },
				{ ruleId: "audios-folder" },
				{ ruleId: "data-folder" },
				{ ruleId: "fonts-subfolder", children: [{ name: "font.css" }] },
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
		"actions-subfolder": {
			name: "impl",
			children: [{ name: "{PascalCase}Impl.ts" }, { name: "{camelCase}", ruleId: "actions-subfolder" }],
		},
	},
});
