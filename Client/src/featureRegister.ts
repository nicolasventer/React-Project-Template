import { todoFeature } from "@/features/todo";
import type { RoutePath } from "@/shared/logic/route";
import type { RouteWithParams } from "@/utils/BasicRouter";
import { typedEmitter } from "@/utils/TypedEmitter";

type RouteData<T extends RoutePath> = {
	path: T;
	Render: (params: RouteWithParams<T>["params"]) => React.ReactNode;
};

type LifeCycle = () => React.ReactNode;

const featureData = {
	routeDataList: [] as RouteData<RoutePath>[],
	LifeCycleList: [] as LifeCycle[],
};

export type FeatureData = typeof featureData;

// TODO (Later): expose only as param of Feature.onLoad

export const addRouteData = <T extends RoutePath>(routeData: RouteData<T>) => void featureData.routeDataList.push(routeData);
export const addLifeCycle = (lifeCycle: LifeCycle) => void featureData.LifeCycleList.push(lifeCycle);

interface AppEventMap {
	featuresLoaded: (featureData: FeatureData) => void;
}

export const emitter = typedEmitter<AppEventMap>();

export interface Feature {
	onLoad: () => void;
	// onUnload: () => void;
}

declare global {
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	interface AllFeatures {}
}

const allFeatures: AllFeatures = {
	todo: todoFeature,
};

const enabledFeatureList: (keyof AllFeatures)[] = ["todo"];

for (const feature of enabledFeatureList) {
	allFeatures[feature].onLoad();
}

emitter.emit("featuresLoaded", featureData);
