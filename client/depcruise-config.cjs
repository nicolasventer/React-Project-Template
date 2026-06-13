/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
	options: {
		doNotFollow: {
			dependencyTypes: ["npm", "npm-dev", "npm-optional", "npm-peer", "npm-bundled", "npm-no-pkg"],
		},

		includeOnly: "^src",

		exclude: [
			// "^src/shared/utils",
			// "^src/shared/logic",
			// "^src/(app|features)/.*/dict",
			// "^src/(app|features)/.*/.*\\.module\\.css",
		],

		tsPreCompilationDeps: false,

		tsConfig: {
			fileName: "./tsconfig.json",
		},

		progress: { type: "performance-log" },

		reporterOptions: {
			archi: {
				collapsePattern: "^src/.*/(dict|logic|utils)|^src/app/assets|^src/app/components|^src/features/[^/]+/components",

				theme: {
					modules: [
						{
							criteria: { collapsed: true },
							attributes: { shape: "tab" },
						},
					],
					graph: {
						rankdir: "TB",
						ranksep: "0.7",
					},
				},
			},
		},
	},
};
