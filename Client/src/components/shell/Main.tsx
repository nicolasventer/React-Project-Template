import { actions } from "@/actions/actions.impl";
import { appStore } from "@/globalState";
import { RouterRender } from "@/routerInstance.gen";
import { Box } from "@/utils/ComponentToolbox";
import { useIntersection } from "@mantine/hooks";
import { useRef } from "react";

export const Main = () => {
	const containerRef = useRef<HTMLDivElement>(null);
	const { ref, entry } = useIntersection({
		root: containerRef.current,
		threshold: 1,
	});

	appStore.useEffect(() => actions.shell.main.isScrollable.update(!entry?.isIntersecting), [entry?.isIntersecting]);

	return (
		<Box widthFull heightFull positionRelative padding={12} overflowAuto ref={containerRef} className="main-container">
			<Box heightMaxContent ref={ref}>
				<RouterRender subPath="/" />
			</Box>
		</Box>
	);
};
