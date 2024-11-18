import Bun from "bun";
import fs from "fs";

const TR_DIR = "./src/tr";

const argFileName = Bun.argv[2] || "*";

const buildFile = async (fileName: string) => {
	const jsFile = fileName.replace(".ts", ".js");
	await Bun.$`bun build ${fileName} --outfile=${jsFile} --minify`;
};

if (argFileName === "*") {
	for (const fileName of fs.readdirSync(TR_DIR)) {
		if (!fileName.endsWith(".ts")) continue;
		const jsFile = fileName.replace(".ts", ".js");
		const trPath = `${TR_DIR}/${fileName}`;
		const jrPath = `${TR_DIR}/${jsFile}`;
		if (fs.existsSync(jrPath)) {
			const tsFileStat = fs.statSync(trPath);
			const jsFileStat = fs.statSync(jrPath);
			if (tsFileStat.mtimeMs < jsFileStat.mtimeMs) continue;
		}
		await buildFile(trPath);
	}
} else if (argFileName.endsWith(".ts") && fs.existsSync(argFileName)) {
	await buildFile(argFileName);
}
