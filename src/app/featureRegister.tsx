import configStr from "@/../config.jsonc?raw";
import { CounterFeature } from "@/features/counter";
import { TimerFeature } from "@/features/timer";
import type { FeatureType } from "@/shared/Config";
import { getValidConfig } from "@/shared/Config";
import type { Feature } from "@/shared/types/Feature";

const config = getValidConfig(configStr);

const featureRegister: Record<FeatureType, Feature> = {
	counter: CounterFeature,
	timer: TimerFeature,
};

export const enabledFeatures = Object.entries(config.features.common)
	.filter(([_, value]) => value.enabled)
	.map(([key, _]) => featureRegister[key as FeatureType]);
