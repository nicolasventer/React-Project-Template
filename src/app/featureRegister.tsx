import configStr from "@/../config.jsonc?raw";
import { Counter } from "@/features/counter/components/Counter";
import { Timer } from "@/features/timer/components/Timer";
import type { FeatureType } from "@/shared/Config";
import { getValidConfig } from "@/shared/Config";
import type { Feature } from "@/shared/types/Feature.types";

const config = getValidConfig(configStr);

const featureRegister: Record<FeatureType, Feature> = {
	counter: {
		route: "/counter?start?increment",
		Render: Counter,
	},
	timer: {
		route: "/timer?interval",
		Render: Timer,
	},
};

export const enabledFeatures = Object.entries(config.features)
	.filter(([_, value]) => value.enabled)
	.map(([key, _]) => featureRegister[key as FeatureType]);
