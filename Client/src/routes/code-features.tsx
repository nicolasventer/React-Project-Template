import { mainContentStore } from "@/globalState";
import { useRef } from "react";

export const CodeFeatures = () => {
	const mainContentRef = useRef<HTMLDivElement>(null);
	mainContentStore.useEffect((setMainContent) => setMainContent(mainContentRef.current), [mainContentRef.current]);

	return <div ref={mainContentRef}>Code Features (TODO)</div>;
};
