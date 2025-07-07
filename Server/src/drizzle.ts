import * as relations from "@/drizzle/relations";
import * as schema from "@/drizzle/schema";
import { DATABASE_URL } from "@/env";
import type { Column } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/bun-sqlite";

export { relations, schema };

export const db = drizzle(DATABASE_URL, { schema: { ...schema, ...relations } });

export const json_group_array = <T>(column: Column) => sql<T[]>`json_group_array(${column})`;
