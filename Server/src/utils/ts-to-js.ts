import { t } from "elysia";
import * as ts from "typescript";

export const TsToJsSchema = t.Union([
	t.String({ description: "The compiled code that has been executed" }),
	t.Object({ error: t.String({ description: "The error message if the compilation fails" }) }),
]);
export type TsToJsType = typeof TsToJsSchema.static;

export function tsToJs(tsCode: string): TsToJsType {
	const options: ts.TranspileOptions = {
		compilerOptions: {
			// Target ESNext for modern JavaScript features
			target: ts.ScriptTarget.ESNext,
			// Module commonjs for Node.js environments
			module: ts.ModuleKind.CommonJS,
			// Emit only JavaScript, no declaration files
			noEmitOnError: false, // Don't throw if there are errors during compilation
			// You can add more compiler options as needed, e.g., strict: true
		},
	};

	// Transpile the TypeScript code string
	const result = ts.transpileModule(tsCode, options);

	if (result.diagnostics && result.diagnostics.length > 0) {
		let error = "TypeScript compilation errors:";
		result.diagnostics.forEach((diagnostic) => {
			const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
			if (diagnostic.file) {
				const { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start!);
				error += `  Error ${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}\n`;
			} else {
				error += `  Error: ${message}\n`;
			}
		});
		console.error(error);
		return { error }; // Indicate failure
	}

	return result.outputText;
}
