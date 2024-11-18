import cors from "@elysiajs/cors";
import type { treaty } from "@elysiajs/eden";
import swagger from "@elysiajs/swagger";
import Elysia from "elysia";
import { closeSync, existsSync, fstatSync, openSync, readdirSync } from "fs";
import path from "path";
import Watcher from "watcher";
import { PORT, SRV_URL } from "./Common/CommonConfig";

const CLIENT_PATH = path.join(__dirname, "../../Client");
const DIST_SUBPATH = "dist" as const;
const DIST_PATH = path.join(CLIENT_PATH, DIST_SUBPATH);
const DOC_SUBPATH = "typedoc_out" as const;
const DOC_PATH = path.join(CLIENT_PATH, DOC_SUBPATH);

const distFiles = existsSync(DIST_PATH)
	? readdirSync(DIST_PATH, { withFileTypes: true, recursive: true })
			.filter((file) => file.isFile())
			.map((file) => path.join(file.parentPath, file.name))
	: [];
const docsFiles = existsSync(DOC_PATH)
	? readdirSync(DOC_PATH, { withFileTypes: true, recursive: true })
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
watcher.watch(DOC_PATH, { recursive: true, native: true });

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
	".js.map": "application/json",
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
		const reqPath =
			req.path.startsWith(`/${DIST_SUBPATH}/`) || req.path.startsWith(`/${DOC_SUBPATH}/`)
				? req.path
				: `/${DIST_SUBPATH}${req.path}`;
		const pathname =
			reqPath === `/${DIST_SUBPATH}/`
				? `/${DIST_SUBPATH}/index.html`
				: reqPath === `/${DOC_SUBPATH}/`
				? `/${DOC_SUBPATH}/index.html`
				: reqPath;
		const joinedPath = path.join(CLIENT_PATH, pathname);
		console.log("joinedPath:", joinedPath);
		if (files.includes(joinedPath))
			return new Response(filesContent[joinedPath], { headers: { "Content-Type": getMimeType(joinedPath) } });
		return new Response(`${req.path} not found`, { status: 404 });
	})
	.get("/api/status", () => "Server is running")
	.listen(PORT);

/**
 * @ignore
 * The type of the API (copy-pasted from the client).
 */
export type Api = ReturnType<typeof treaty<typeof app>>["api"];

console.log(`Server started on ${SRV_URL}`);
console.log(`Docs available on ${SRV_URL}/${DOC_SUBPATH}/`);
console.log(`Swagger available on ${SRV_URL}/swagger`);
