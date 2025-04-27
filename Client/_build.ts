import Bun from "bun";
import fs from "fs";

fs.rmSync("./dist", { recursive: true, force: true });
console.log("dist folder removed");

const result = await Bun.$`bunx --bun vite build`;

if (result.exitCode) {
	console.error("Build failed");
	process.exit(1);
}

console.log("build done");
fs.copyFileSync("./bun_index.html", "./dist/index.html");
console.log("bun_index.html copied");
fs.mkdirSync("./dist/src/assets/images", { recursive: true });
for (const file of fs.readdirSync("./src/assets/images"))
	fs.copyFileSync(`./src/assets/images/${file}`, `./dist/src/assets/images/${file}`);
console.log("images folder copied");
