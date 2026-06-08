import * as t from "@sinclair/typebox";
import type { ValueError } from "@sinclair/typebox/value";
import { Value } from "@sinclair/typebox/value";
import { JSONC } from "jsonc.min";

const JSON_SCHEMA_PATH = "config.schema.json";
const JSON_CONFIG_PATH = "config.jsonc";

export const B_PROD = true;

export const LOCAL_STORAGE_KEY_PREFIX = "react-project-template:";

export const getLocalStorageKey = (key: string) => `${LOCAL_STORAGE_KEY_PREFIX}${key}`;

const ConfigSchema = t.Object(
	{
		$schema: t.String(),
		features: t.Object({
			counter: t.Object({ enabled: t.Boolean(), specific: t.Optional(t.Object({ increment: t.Number() })) }),
			timer: t.Object({ enabled: t.Boolean() }),
		}),
	},
	{ $id: "Config" },
);

export type Config = t.Static<typeof ConfigSchema>;

export type FeatureType = keyof Config["features"];

const DefaultConfig: Config = {
	$schema: JSON_SCHEMA_PATH,
	features: {
		counter: {
			enabled: true,
			specific: {
				increment: 5,
			},
		},
		timer: {
			enabled: true,
		},
	},
};

export const getValidConfig = (configStr: string): Config => {
	const obj = JSONC.parse(configStr);
	const errors: ValueError[] = [];
	errors.push(...Value.Errors(ConfigSchema, obj));
	if (errors.length > 0) {
		console.error("Config errors:", errors);
		const message = errors.map((err) => `❌ ${err.path || "(root)"}: ${err.message}`).join("\n");
		throw new Error(message, { cause: errors });
	}
	return obj as Config;
};

if (import.meta.main) {
	await Bun.write(JSON_SCHEMA_PATH, JSON.stringify(ConfigSchema, null, 2));
	await Bun.write(JSON_CONFIG_PATH, JSON.stringify(DefaultConfig, null, 2));
	console.log(`Generated: ${JSON_SCHEMA_PATH}, ${JSON_CONFIG_PATH}`);
}
