import type { FeatureData } from "@/featureRegister";
import { emitter } from "@/featureRegister";
import { store } from "@/utils/Store";

const featureData = store<FeatureData>();
emitter.on("featuresLoaded", (data) => featureData.setValue(data));

export const AppLifeCycle = () => {
	const data = featureData.use();

	// eslint-disable-next-line react/no-array-index-key
	return data?.LifeCycleList.map((LifeCycle, index) => <LifeCycle key={index} />) ?? [];
};
