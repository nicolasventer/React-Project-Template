import preact from "@preact/preset-vite";
import { routerPlugin } from "easy-react-router/plugin";
import path from "path";
import { env } from "process";
import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";
import { watch } from "vite-plugin-watch";

const langBuildWatcher = watch({
	pattern: "src/tr/*.ts",
	command: (file) => `bun run ./_lang_build.ts ${file}`,
});

export default defineConfig({
	base: "./", // remove base if deployed with vite commands (i.e. `bunx --bun vite build` && `vite preview`)
	plugins: [
		preact(),
		...(env.USE_HTTPS ? [mkcert()] : []),
		langBuildWatcher,
		routerPlugin({ lazyComponent: { eslintDisableWarning: true } }),
	],
	server: {
		watch: {
			ignored: ["**/playwright-report/**", "**/coverage-reports/**"],
		},
	},
	resolve: { alias: { "@": path.resolve(__dirname, "src") } },
	build: {
		rollupOptions: {
			output: {
				dir: path.resolve(__dirname, "dist"),
				entryFileNames: "[name].js",
				assetFileNames: "asset/[name].[ext]",
				chunkFileNames: "[name].chunk.js",
				manualChunks: undefined,
			},
			onLog(level, log, handler) {
				if (log.code === "MODULE_LEVEL_DIRECTIVE") return;
				handler(level, log);
			},
		},
	},
});
