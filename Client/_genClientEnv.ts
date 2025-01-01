import Bun from "bun";
import { env } from "process";

Bun.write(
	"./src/Shared/bProd.gen.ts",
	`/** enable production mode */
export const B_PROD = ${env.B_PROD ?? "false"};`
);
console.log("bProd.gen.ts generated successfully.");
