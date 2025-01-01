// @ts-check

import { createFolderStructure } from "eslint-plugin-project-structure";

export const folderStructureConfig = createFolderStructure({
	structure: [
		// Allow any files in the root of your project, like package.json, eslint.config.mjs, etc.
		// You can add rules for them separately.
		// You can also add exceptions like this: "(?!folderStructure)*".
		{ name: "*" },

		// Allow any folders in the root of your project.
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
				// src/data/
				{ ruleId: "data-folder" },
				// src/fonts/
				{ name: "fonts", children: [{ name: "font.css" }], ruleId: "fonts-subfolder" },
				// src/hooks/
				{ name: "hooks", children: [{ name: "use{PascalCase}.(ts|tsx)" }] },
				// src/libs/
				{ name: "libs", children: [] },
				// src/routes/
				{ ruleId: "routes-folder" },
				// src/tr/
				{ name: "tr", children: [{ name: "{snake_case}.(ts|js)" }] },

				// src/Actions/
				{
					name: "Actions",
					children: [
						{ name: "actions.(impl|interface|state|types|utils).ts" },
						{ name: "_*.ts" },
						{ ruleId: "actions-subfolder" },
					],
				},

				// src/features/
				{ name: "features", children: [{ ruleId: "features-subfolder" }] },

				// src/Shared/
				{ name: "Shared", children: [] },
			],
		},
	],

	rules: {
		"features-subfolder": {
			// Shared features start with `_`
			name: "_?{PascalCase}",
			children: [
				{ name: "{folderName}.(api|getters|setters|imports).ts" },
				{
					name: "{PascalCase}",
					children: [
						{ name: "{FolderName}.((lazy.)?tsx|utils.ts)" },
						{ name: "{FolderName}.module.css" },
						{ name: "_{PascalCase}.((lazy.)?tsx|utils.ts)" },
					],
				},
			],
		},
		"routes-folder": {
			name: "routes",
			children: [{ name: "*.tsx" }, { name: "*", ruleId: "routes-folder" }],
		},
		"assets-folder": {
			name: "assets",
			children: [{ name: "*.(png|jpg|jpeg|gif|svg)" }, { name: "*", ruleId: "assets-folder" }],
		},
		"data-folder": {
			name: "data",
			children: [{ name: "*.json" }, { name: "*", ruleId: "data-folder" }],
		},
		"fonts-subfolder": {
			children: [{ name: "*.(eot|ttf|woff|woff2)" }, { name: "*", ruleId: "fonts-subfolder" }],
		},
		"actions-subfolder": {
			name: "impl",
			children: [{ name: "{PascalCase}Impl.ts" }, { name: "{camelCase}", ruleId: "actions-subfolder" }],
		},
	},
});
