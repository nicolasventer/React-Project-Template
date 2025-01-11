import Bun from "bun";
import fs from "fs";

fs.rmSync("./dist", { recursive: true, force: true });
console.log("dist folder removed");

// temporary solution for building with plugin @preact/signals-react-transform
const result = await Bun.$`bunx --bun vite build`;

if (result.exitCode) {
	console.error("Build failed");
	process.exit(1);
}

console.log("build done");
fs.copyFileSync("./bun_index.html", "./dist/index.html");
console.log("bun_index.html copied");
fs.mkdirSync("./dist/tr");
for (const file of fs.readdirSync("./src/tr")) {
	if (!file.endsWith(".js")) continue;
	fs.copyFileSync(`./src/tr/${file}`, `./dist/tr/${file}`);
}
console.log("tr folder copied");
