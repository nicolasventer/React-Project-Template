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
				// src/api.ts
				{ name: "api.ts" },
				// src/dao.ts
				{ name: "dao.ts" },
				// src/drizzle.ts
				{ name: "drizzle.ts" },
				// src/elysiaPlugins.ts
				{ name: "elysiaPlugins.ts" },
				// src/env.ts
				{ name: "env.ts" },
				// src/impl.ts
				{ name: "impl.ts" },
				// src/index.ts
				{ name: "index.ts" },
				// src/jwt.ts
				{ name: "jwt.ts" },
				// src/mail.ts
				{ name: "mail.ts" },
				// src/srv_config.ts
				{ name: "srv_config.ts" },
				// src/testConfig.ts
				{ name: "testConfig.ts" },
				// src/testIndex.ts
				{ name: "testIndex.ts" },
				// src/winston.ts
				{ name: "winston.ts" },
				// src/_override.ts
				{ name: "_override.ts" },
				// src/drizzle/
				{ name: "drizzle", children: [{ name: "schema.ts" }, { name: "relations.ts" }] },
				// src/*.gen.ts
				{ name: "*.gen.ts" },
				// src/assets/
				{ ruleId: "assets-folder" },
				// src/routes/
				{ name: "routes", children: [{ name: "routes.ts" }, { ruleId: "routes-subfolder" }] },
				// src/Shared/
				{ name: "Shared", children: [] },
				// src/utils/
				{ name: "utils", children: [] },
			],
		},
	],

	rules: {
		"routes-subfolder": {
			name: "{kebab-case}",
			children: [{ name: "{folder-name}.(impl|routes|dao).ts" }, { ruleId: "routes-subfolder" }],
		},
		"assets-folder": {
			name: "assets",
			children: [
				{ ruleId: "images-folder" },
				{ ruleId: "videos-folder" },
				{ ruleId: "audios-folder" },
				{ ruleId: "data-folder" },
				{ name: "fonts", children: [{ name: "font.css" }], ruleId: "fonts-subfolder" },
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
			children: [{ name: "*.(eot|ttf|woff|woff2)" }, { name: "*", ruleId: "fonts-subfolder" }],
		},
	},
});
