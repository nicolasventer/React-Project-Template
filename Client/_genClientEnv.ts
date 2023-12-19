import Bun from "bun";
import { env } from "process";

Bun.write(
	"./src/_bProd.ts",
	`/** enable production mode */
export const B_PROD = ${env.B_PROD ?? "false"};`
);
console.log("_bProd.ts generated successfully.");
