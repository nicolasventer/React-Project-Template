import type { Lang } from "@/dict";
import { appStore, mainContentStore } from "@/globalState";
import type { LazySingleLoaderReturn } from "easy-react-router";
import type { ReactNode } from "react";
import { useRef } from "react";
import styles from "./index.index.module.css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AllMarkdown = Record<Lang, LazySingleLoaderReturn<(props: any) => ReactNode>>;

export const MarkdownLayout = ({ allMarkdown }: { allMarkdown: AllMarkdown }) => {
	const app = appStore.use();
	const colorScheme = app.colorScheme.value;
	const lang = app.lang.value;

	const MarkdownValue = allMarkdown[lang].Component;
	const markdownLoading = allMarkdown[lang].useLoading();

	const mainContentRef = useRef<HTMLDivElement>(null);
	mainContentStore.useEffect(
		(setMainContent) => void (markdownLoading === "loaded" && setMainContent(mainContentRef.current)),
		[mainContentRef.current, markdownLoading]
	);
	mainContentStore.useEffect(
		(setMainContent) => {
			const oldMainContent = mainContentRef.current;
			setMainContent(null);
			setTimeout(() => setMainContent(oldMainContent), 100);
		},
		[lang]
	);

	return (
		<div ref={mainContentRef} className={colorScheme === "dark" ? styles.dark : ""}>
			<MarkdownValue />
		</div>
	);
};
