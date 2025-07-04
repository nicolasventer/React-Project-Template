import { DATABASE_URL } from "@/env";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./src/drizzle",
	schema: "./src/drizzle/schema.ts",
	dialect: "sqlite",
	dbCredentials: {
		url: DATABASE_URL,
	},
});
