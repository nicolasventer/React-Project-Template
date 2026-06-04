import * as t from "@sinclair/typebox";
import { Assert } from "@sinclair/typebox/value";
import { JSONC } from "jsonc.min";

const FeatureTypeSchema = t.Union([t.Literal("counter"), t.Literal("timer")], { $id: "FeatureType" });

export type FeatureType = t.Static<typeof FeatureTypeSchema>;

const ConfigSchema = t.Object(
	{
		$schema: t.String(),
		features: t.Record(FeatureTypeSchema, t.Object({ enabled: t.Boolean() }, { additionalProperties: false })),
	},
	{ $id: "Config", additionalProperties: false },
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
		},
	},
};

export const getValidConfig = (config: string): Config => {
	const obj = JSONC.parse(config);
	Assert(ConfigSchema, obj);
	return obj;
};

if (import.meta.main) {
	await Bun.write("config.schema.json", JSON.stringify(ConfigSchema, null, 2));
	if (!(await Bun.file("config.json").exists())) await Bun.write("config.jsonc", JSON.stringify(DefaultConfig, null, 2));
}
