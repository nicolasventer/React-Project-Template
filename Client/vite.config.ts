import preact from "@preact/preset-vite";
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
	base: "./",
	plugins: env.USE_HTTPS ? [preact(), mkcert(), langBuildWatcher] : [preact(), langBuildWatcher],
	build: {
		rollupOptions: {
			output: {
				// eslint-disable-next-line no-undef
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
