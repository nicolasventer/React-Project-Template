import { config } from "@/config/bootstrap/config";
import type { FeatureType } from "@/config/Config";
import { CounterFeature } from "@/features/counter";
import { TimerFeature } from "@/features/timer";
import type { Feature } from "@/shared/types/Feature";

const featureRegister: Record<FeatureType, Feature> = {
	counter: CounterFeature,
	timer: TimerFeature,
};

export const enabledFeatures = Object.entries(config.features)
	.filter(([_, value]) => value.enabled)
	.map(([key, _]) => featureRegister[key as FeatureType]);
