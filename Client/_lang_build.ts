import Bun from "bun";
import fs from "fs";

const TR_DIR = "./src/tr";

const file = Bun.argv[2] ?? "*";

const buildFile = async (file: string) => {
	const jsFile = file.replace(".ts", ".js");
	await Bun.$`bun build ${file} --outfile=${jsFile} --minify`;
};

if (file === "" || file === "*") {
	for (const file of fs.readdirSync(TR_DIR)) {
		if (!file.endsWith(".ts")) continue;
		const jsFile = file.replace(".ts", ".js");
		const trPath = `${TR_DIR}/${file}`;
		const jrPath = `${TR_DIR}/${jsFile}`;
		if (fs.existsSync(jrPath)) {
			const tsFileStat = fs.statSync(trPath);
			const jsFileStat = fs.statSync(jrPath);
			if (tsFileStat.mtimeMs < jsFileStat.mtimeMs) continue;
		}
		await buildFile(trPath);
	}
} else if (file.endsWith(".ts") && fs.existsSync(file)) {
	await buildFile(file);
}
