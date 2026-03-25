/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
	options: {
		doNotFollow: {
			dependencyTypes: ["npm", "npm-dev", "npm-optional", "npm-peer", "npm-bundled", "npm-no-pkg"],
		},

		includeOnly: "^src",

		exclude: ["^src/(logic|utils|dict)", "^src/(logic|localStorage).ts", "^src/(routes|pages)/.*.css"],

		tsPreCompilationDeps: false,

		tsConfig: {
			fileName: "./tsconfig.json",
		},

		progress: { type: "performance-log" },

		reporterOptions: {
			archi: {
				collapsePattern: "^src/assets|^src/components/[^/]*",

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
