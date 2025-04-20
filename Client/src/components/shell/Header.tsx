import { DarkModeButton } from "@/components/_app/DarkModeButton";
import { LanguageButton } from "@/components/_app/LanguageButton";
import type { Lang } from "@/dict";
import type { ColorSchemeType } from "@/Shared/SharedModel";
import { Horizontal } from "@/utils/ComponentToolbox";
import { Title } from "@mantine/core";

export const Header = ({
	lang,
	isLangLoading,
	colorScheme,
	isColorSchemeLoading,
}: {
	lang: Lang;
	isLangLoading: boolean;
	colorScheme: ColorSchemeType;
	isColorSchemeLoading: boolean;
}) => (
	<Horizontal justifyContent="space-between" padding={12}>
		<Title order={2}>React Project Template</Title>
		<Horizontal gap={6}>
			<LanguageButton lang={lang} isLoading={isLangLoading} useTransition={false} />
			<DarkModeButton isDark={colorScheme === "dark"} isLoading={isColorSchemeLoading} useTransition={false} />
		</Horizontal>
	</Horizontal>
);
