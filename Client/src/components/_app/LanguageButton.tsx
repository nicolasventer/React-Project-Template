import { actions } from "@/actions/actions.impl";
import type { Lang } from "@/dict";
import { LangValues } from "@/dict";
import { app } from "@/globalState";
import { Vertical } from "@/utils/ComponentToolbox";
import { ActionIcon, Button, Popover, Select } from "@mantine/core";
import { Languages } from "lucide-react";

const LanguageDisplay: Record<Lang, string> = {
	en: "English",
	fr: "Français",
};

export const LanguageButton = ({ useTransition }: { useTransition: boolean }) => {
	const lang = app.lang.data.use();
	const isLoading = app.lang.isLoading.use();

	return (
		<Popover position="bottom-end" withArrow>
			<Popover.Target>
				<ActionIcon loading={isLoading} variant="light">
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
};

export const LanguageButton2 = ({ useTransition }: { useTransition: boolean }) => {
	const lang = app.lang.data.use();
	const isLoading = app.lang.isLoading.use();

	return (
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
};
