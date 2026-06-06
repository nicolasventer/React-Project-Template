import { enabledFeatures } from "@/app/featureRegister";
import { route } from "@/app/logic/route";
import { SwitchV } from "@/shared/utils/MultiIf";

export const App = () => {
	const r = route.router.use();

	return (
		<div>
			<h1>App</h1>
			{enabledFeatures.map((feature) => (
				<div key={feature.link}>
					<a href={feature.link}>{feature.link}</a>
				</div>
			))}
			<SwitchV
				value={r}
				transform={(r) => r.path}
				cases={enabledFeatures.map((feature) => [feature.route.path, () => <feature.route.Render {...r.params} />])}
			/>
		</div>
	);
};
