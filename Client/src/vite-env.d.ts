/// <reference types="vite/client" />

declare module "*.svg?react" {
	import type { FC, SVGProps } from "react";
	const ReactComponent: FC<SVGProps<SVGSVGElement>>;
	export default ReactComponent;
}

declare namespace React {
	interface CSSProperties {
		[key: `--${string}`]: string | number;
	}
}
