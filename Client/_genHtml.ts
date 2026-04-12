import Bun from "bun";
import fs from "fs";
import path from "path";

const usage = () => {
	console.log(`Usage: bun _genHtml.ts [htmlFile]
	Use [htmlFile] as template to generate html files according to staticRoutes.yaml`);
	process.exit(0);
};

if (Bun.argv.includes("--help") || Bun.argv.length !== 3) usage();

// const HTML_FILE = "staticIndex.html";
const HTML_FILE = Bun.argv[2];
if (!HTML_FILE) usage();
if (!fs.existsSync(HTML_FILE)) {
	console.error(`htmlFile ${HTML_FILE} not found`);
	process.exit(1);
}
const STATIC_ROUTES_FILE = "staticRoutes.yaml";

const htmlFileContent = await Bun.file(HTML_FILE).text();
const htmlFolder = path.dirname(HTML_FILE);

const staticRoutesContent = await Bun.file(STATIC_ROUTES_FILE).text();
const staticRoutesArray = staticRoutesContent
	.split("\n")
	.filter((line) => line.startsWith("- "))
	.map((line) => line.slice(2));

for (const staticRoute of staticRoutesArray) {
	const folder = path.dirname(staticRoute);
	const fileName = path.basename(staticRoute).trim();
	if (!fileName) continue;
	const subFolderCount = folder.split("/").filter((f) => f).length;
	const subFolder = subFolderCount === 0 ? "./" : "../".repeat(subFolderCount);
	const staticHtmlFilePath = `${htmlFolder}${folder === "/" ? "" : folder}/${fileName}.html`;
	await Bun.write(
		staticHtmlFilePath,
		htmlFileContent
			// replace all ./ with subFolder
			.replace(/\.\//g, subFolder),
	);
	console.log(`${staticHtmlFilePath} generated.`);
}
