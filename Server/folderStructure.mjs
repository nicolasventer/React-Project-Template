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
				// src/index.ts
				{ name: "index.ts" },
				// src/testIndex.ts
				{ name: "testIndex.ts" },
				// src/testConfig.ts
				{ name: "testConfig.ts" },
				// src/api.ts
				{ name: "api.ts" },
				// src/*.gen.ts
				{ name: "*.gen.ts" },
				// src/assets/
				{ ruleId: "assets-folder" },
				// src/routes/
				{ name: "routes", children: [{ name: "routes.ts" }, { ruleId: "routes-subfolder" }] },
				// src/Shared/
				{ name: "Shared", children: [] },
				// src/toOrganize/
				{ name: "toOrganize", children: [] }, // TODO: toOrganize folder should be removed, now it can contain folders like database
			],
		},
	],

	rules: {
		"routes-subfolder": {
			name: "{PascalCase}",
			children: [{ name: "{folderName}.(impl|routes).ts" }, { ruleId: "routes-subfolder" }],
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
