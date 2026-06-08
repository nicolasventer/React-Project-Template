import { cp, mkdir, readdir, stat } from "node:fs/promises";
import { join } from "node:path";

const SRC_DIR = "dist";
const DEST_DIR = join("..", "docs");

async function ensureDir(dir: string) {
	try {
		await stat(dir);
	} catch {
		await mkdir(dir, { recursive: true });
	}
}

if (import.meta.main) {
	await ensureDir(DEST_DIR);

	for (const entry of await readdir(SRC_DIR)) {
		await cp(join(SRC_DIR, entry), join(DEST_DIR, entry), { recursive: true });
	}

	console.log(`Deployed ${SRC_DIR}/* -> ${DEST_DIR}`);
}
