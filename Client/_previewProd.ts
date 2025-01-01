import { clientEnv } from "@/clientEnv";
import Bun from "bun";
import fs from "fs";

const previewFolder = `.${clientEnv.BASE_URL}`;
fs.rmSync(previewFolder, { recursive: true, force: true });
console.log("Preview folder removed");

fs.cpSync("./dist", previewFolder, { recursive: true });
console.log("dist folder copied to preview folder");

console.log(`Preview URL: http://localhost:4173/${clientEnv.BASE_URL}/ (do not forget the ending slash)`);
await Bun.$`cmd /c "start http://localhost:4173/${clientEnv.BASE_URL}/"`;

process.on("SIGINT", () => {
	console.log("Server stopped");
	fs.rmSync(previewFolder, { recursive: true, force: true });
	console.log("Preview folder removed");
	process.exit();
});

await Bun.$`serve -l 4173 .`;
