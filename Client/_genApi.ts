import { Project, ts } from "ts-morph";

// Create a project and add TypeScript source code
const project = new Project({
	tsConfigFilePath: "../Server/tsconfig.json",
});
const sourceFile = project.getSourceFileOrThrow("../Server/src/api.ts");

// Get the variable declaration
const variable = sourceFile.getVariableDeclarationOrThrow("_api");

// Get the type of the variable
const type = variable.getType();

// Get the expanded structure of the type
const expandedType = type.getText(undefined, ts.TypeFormatFlags.InTypeAlias);

// Write the expanded type to a file
Bun.write(
	"src/api/api.gen.ts",
	`import type { LanguageType, PermissionType } from "@/Shared/SharedModel";
import type { Treaty } from "@elysiajs/eden";

type GoodTreatyResponse<T extends Record<number, unknown>> = Treaty.TreatyResponse<T>;
type TreatyResponse<T extends Record<number, unknown>> = { [K in keyof T]: GoodTreatyResponse<{ [_ in K]: T[K] }> }[keyof T];

/**
 * @ignore
 * Type definition for the API object, retrieved from the server
 */
export type Api = ${expandedType
		.replace(/Files/g, "PermissionType[]")
		.replace(/language: string \| number/g, "language: LanguageType")};`
);

console.log("api.gen.ts generated successfully.");
