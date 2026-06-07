import { config } from "@/bootstrap/config";
import { CounterFeature } from "@/features/counter";
import { TimerFeature } from "@/features/timer";
import type { FeatureType } from "@/shared/Config";
import type { Feature } from "@/shared/types/Feature";

const featureRegister: Record<FeatureType, Feature> = {
	counter: CounterFeature,
	timer: TimerFeature,
};

export const enabledFeatures = Object.entries(config.features)
	.filter(([_, value]) => value.enabled)
	.map(([key, _]) => featureRegister[key as FeatureType]);
