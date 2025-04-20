import mdx from "@mdx-js/rollup";
import react from "@vitejs/plugin-react";
import { routerPlugin } from "easy-react-router/plugin";
import path from "path";
import { env } from "process";
import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";
import autoMemo from "./auto-memo";

export default defineConfig({
	// remove base if deployed with vite commands (i.e. `bunx --bun vite build` && `vite preview`)
	// deployment with vite commands is required when some path are dynamic (i.e. `/hello/:name`)
	base: "./",
	plugins: [
		autoMemo(),
		routerPlugin(),
		{ enforce: "pre", ...mdx() },
		react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
		...(env.USE_HTTPS ? [mkcert()] : []),
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
