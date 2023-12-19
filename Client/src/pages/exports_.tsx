import { lazy, Suspense } from "react";
import type { HomePage as _HomePage } from "./Home";

type Params<T> = T extends (...args: [infer U]) => any ? U : Record<string, never>;

const Suspender = <T extends (...args: any) => any>(Comp: T) => {
	const Suspended = (props: Params<T>) => (
		<Suspense fallback>
			<Comp {...props} />
		</Suspense>
	);
	return Suspended;
};

const defaultLoader =
	<T extends Record<string, any>>(defaultExport: keyof T) =>
	(mod: T) =>
		mod[defaultExport];

// Pages

/** Lazy export of {@link _HomePage | HomePage} */
export const HomePage = Suspender(lazy(() => import("./Home").then(defaultLoader("HomePage"))));
