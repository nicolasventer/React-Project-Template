import type { AllMarkdown } from "@/routes/(markdownLayout)";
import { MarkdownLayout } from "@/routes/(markdownLayout)";
import { lazySingleLoader } from "easy-react-router";

const HomeMarkdown: AllMarkdown = {
	en: lazySingleLoader(() => import("@/assets/markdown/Home_en.mdx"), "default"),
	fr: lazySingleLoader(() => import("@/assets/markdown/Home_fr.mdx"), "default"),
};

export const Home = () => <MarkdownLayout allMarkdown={HomeMarkdown} />;
