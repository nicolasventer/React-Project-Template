/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
	options: {
		doNotFollow: {
			dependencyTypes: ["npm", "npm-dev", "npm-optional", "npm-peer", "npm-bundled", "npm-no-pkg"],
		},

		includeOnly: "^src",

		// exclude: ["^src/Shared"],

		tsPreCompilationDeps: false,

		tsConfig: {
			fileName: "./tsconfig.json",
		},

		progress: { type: "performance-log" },

		reporterOptions: {
			archi: {
				collapsePattern: "^_",

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
