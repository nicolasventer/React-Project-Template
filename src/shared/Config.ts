import * as t from "@sinclair/typebox";
import type { ValueError } from "@sinclair/typebox/value";
import { Value } from "@sinclair/typebox/value";
import { JSONC } from "jsonc.min";

const FeatureTypeSchema = t.Union([t.Literal("counter"), t.Literal("timer")], { $id: "FeatureType" });

export type FeatureType = t.Static<typeof FeatureTypeSchema>;

const ConfigSchema = t.Object(
	{
		$schema: t.String(),
		features: t.Union([
			t.Record(FeatureTypeSchema, t.Object({ enabled: t.Boolean() })),
			t.Object({ timer: t.Object({ specific: t.Object({ interval: t.Number() }) }) }),
		]),
	},
	{ $id: "Config" },
);

export type Config = t.Static<typeof ConfigSchema>;

const DefaultConfig: Config = {
	$schema: "config.schema.json",
	features: {
		counter: {
			enabled: true,
		},
		timer: {
			enabled: true,
			specific: {
				interval: 1000,
			},
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
	await Bun.write("config.schema.json", JSON.stringify(ConfigSchema, null, 2));
	await Bun.write("config.jsonc", JSON.stringify(DefaultConfig, null, 2));
	console.log("Generated: config.schema.json, config.jsonc");
}
