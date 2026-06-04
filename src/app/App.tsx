import { BasicRouter } from "@/shared/utils/BasicRouter";
import { SwitchV } from "@/shared/utils/MultiIf";
import { useMemo } from "react";
import { enabledFeatures } from "./featureRegister";

export const App = () => {
	const router = useMemo(
		() =>
			new BasicRouter(
				enabledFeatures.map((feature) => feature.route),
				true,
			),
		[],
	);
	const route = router.getRouteStore().use();

	return (
		<div>
			<h1>App</h1>
			{enabledFeatures.map((feature) => (
				<div key={feature.route}>
					<a href={feature.route}>{feature.route}</a>
				</div>
			))}
			<SwitchV
				value={route}
				transform={(route) => route.path}
				cases={enabledFeatures.map((feature) => [feature.route, feature.Render])}
			/>
		</div>
	);
};
