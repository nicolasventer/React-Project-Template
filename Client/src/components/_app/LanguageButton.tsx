import { actions } from "@/actions/actions.impl";
import type { Lang } from "@/dict";
import { LangValues } from "@/dict";
import { Vertical } from "@/utils/ComponentToolbox";
import { ActionIcon, Button, Popover, Select } from "@mantine/core";
import { Languages } from "lucide-react";

const LanguageDisplay: Record<Lang, string> = {
	en: "English",
	fr: "Français",
};

export const LanguageButton = ({
	lang,
	isLoading,
	useTransition,
}: {
	lang: Lang;
	isLoading: boolean;
	useTransition: boolean;
}) => (
	<Popover position="bottom-end" withArrow>
		<Popover.Target>
			<ActionIcon loading={isLoading}>
				<Languages />
			</ActionIcon>
		</Popover.Target>
		<Popover.Dropdown p={8}>
			<Vertical gap={8}>
				{LangValues.map((language) => (
					<Button
						key={language}
						onClick={actions.lang.updateFn(language, useTransition)}
						variant={language === lang ? "filled" : "light"}
					>
						{LanguageDisplay[language]}
					</Button>
				))}
			</Vertical>
		</Popover.Dropdown>
	</Popover>
);

export const LanguageButton2 = ({
	lang,
	isLoading,
	useTransition,
}: {
	lang: Lang;
	isLoading: boolean;
	useTransition: boolean;
}) => (
	<Select
		label="Language"
		data={LangValues.map((language) => ({ value: language, label: LanguageDisplay[language] }))}
		value={lang}
		onChange={(value) => actions.lang.updateFn(value as Lang, useTransition)()}
		allowDeselect={false}
		comboboxProps={{ withinPortal: false }}
		disabled={isLoading}
	/>
);
