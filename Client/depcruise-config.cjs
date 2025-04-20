/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
	options: {
		doNotFollow: {
			dependencyTypes: ["npm", "npm-dev", "npm-optional", "npm-peer", "npm-bundled", "npm-no-pkg"],
		},

		includeOnly: "^src",

		exclude: ["^src/utils", "^src/globalState.ts"],

		tsPreCompilationDeps: false,

		tsConfig: {
			fileName: "./tsconfig.json",
		},

		progress: { type: "performance-log" },

		reporterOptions: {
			archi: {
				collapsePattern: "^src/assets",

				theme: {
					modules: [
						{
							criteria: { collapsed: true },
							attributes: { shape: "tab" },
						},
						// {
						// 	criteria: { source: "^src/routes/[^/]+" },
						// 	attributes: { fillcolor: "#ffd9a3" },
						// },
						// {
						// 	criteria: { source: "^src/features/[^/]+/[^/]+" },
						// 	attributes: { fillcolor: "#aedaff" },
						// },
					],
					graph: {
						// splines: "ortho",
						rankdir: "TB",
						ranksep: "0.7",
					},
				},
			},
		},
	},
};
