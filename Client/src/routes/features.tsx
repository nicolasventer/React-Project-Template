import type { AllMarkdown } from "@/routes/(markdownLayout)";
import { MarkdownLayout } from "@/routes/(markdownLayout)";
import { lazySingleLoader } from "easy-react-router";

const FeaturesMarkdown: AllMarkdown = {
	en: lazySingleLoader(() => import("@/assets/markdown/Features_en.mdx"), "default"),
	fr: lazySingleLoader(() => import("@/assets/markdown/Features_fr.mdx"), "default"),
};

export const Features = () => <MarkdownLayout allMarkdown={FeaturesMarkdown} />;
