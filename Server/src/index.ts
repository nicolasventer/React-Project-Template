import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import Elysia from "elysia";
import { closeSync, existsSync, fstatSync, openSync, readdirSync } from "fs";
import path from "path";
import Watcher from "watcher";
import { PORT, SRV_URL } from "./Common/CommonConfig";

const CLIENT_PATH = path.join(__dirname, "../../Client");
const DIST_PATH = path.join(CLIENT_PATH, "dist");
const DOCS_PATH = path.join(CLIENT_PATH, "docs");

const distFiles = existsSync(DIST_PATH)
	? readdirSync(DIST_PATH, { withFileTypes: true, recursive: true })
			.filter((file) => file.isFile())
			.map((file) => path.join(file.parentPath, file.name))
	: [];
const docsFiles = existsSync(DOCS_PATH)
	? readdirSync(DOCS_PATH, { withFileTypes: true, recursive: true })
			.filter((file) => file.isFile())
			.map((file) => path.join(file.parentPath, file.name))
	: [];

const files = [...distFiles, ...docsFiles];

const filesContent = await (async () => {
	const result = {} as Record<string, string>;
	await Promise.all(files.map(async (file) => (result[file] = await Bun.file(file).text())));
	return result;
})();

const filesStatSize = await (async () => {
	const result = {} as Record<string, number>;
	await Promise.all(
		files.map(async (file) => {
			const path_fd = openSync(file, "r");
			const path_stat = fstatSync(path_fd);
			closeSync(path_fd);
			result[file] = path_stat.size;
		})
	);
	return result;
})();

const watcher = new Watcher(DIST_PATH, { recursive: true, native: true });
watcher.watch(DOCS_PATH, { recursive: true, native: true });

const updateFile = (filename: string) => {
	const oldSize = filesStatSize[filename];
	const path_fd = openSync(filename, "r");
	const path_stat = fstatSync(path_fd);
	closeSync(path_fd);
	const newSize = path_stat.size;
	if (oldSize === newSize) return;
	filesStatSize[filename] = newSize;
	Bun.file(filename)
		.text()
		.then((content) => (filesContent[filename] = content));
	console.log("File updated:", filename);
};

const deleteFile = (filename: string) => {
	delete filesContent[filename];
	delete filesStatSize[filename];
	console.log("File deleted:", filename);
};

watcher.on("add", updateFile);
watcher.on("change", updateFile);
watcher.on("rename", deleteFile);
watcher.on("unlink", deleteFile);

const mimeTypes = {
	".html": "text/html",
	".css": "text/css",
	".js": "application/javascript",
	".json": "application/json",
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".gif": "image/gif",
	".svg": "image/svg+xml",
	".ico": "image/x-icon",
};

const getMimeType = (filename: string) => {
	for (const ext in mimeTypes) if (filename.endsWith(ext)) return mimeTypes[ext as keyof typeof mimeTypes];
	return "text/plain";
};

/**
 * @ignore See documentation in the swagger description.
 * The Elysia server.
 */
export const app = new Elysia()
	.use(cors())
	.use(swagger())
	.get("*", (req) => {
		const reqPath = req.path.startsWith("/dist/") || req.path.startsWith("/docs/") ? req.path : `/dist${req.path}`;
		const pathname = reqPath === "/dist/" ? "/dist/index.html" : reqPath === "/docs/" ? "/docs/index.html" : reqPath;
		const joinedPath = path.join(CLIENT_PATH, pathname);
		console.log("joinedPath:", joinedPath);
		if (files.includes(joinedPath))
			return new Response(filesContent[joinedPath], { headers: { "Content-Type": getMimeType(joinedPath) } });
		return new Response(`${req.path} not found`, { status: 404 });
	})
	.get("/api/status", () => "Server is running")
	.listen(PORT);

/**
 * @ignore See documentation in the swagger description.
 * The type of the Elysia server.
 */
export type App = typeof app;

console.log(`Server started on ${SRV_URL}`);
