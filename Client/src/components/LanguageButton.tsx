import { ActionIcon, Button, Popover, Select } from "@mantine/core";
import { Languages } from "lucide-react";
import { LANGUAGES, type LanguageType } from "../Common/CommonModel";
import { _isLanguageLoading, gs } from "../context/GlobalState";
import { setLanguageFn } from "../context/userActions";
import { Vertical } from "../utils/ComponentToolbox";

const LanguageDisplay: Record<LanguageType, string> = {
	en: "English",
	fr: "Français",
};

/**
 * A button that changes the language of the application
 * @param params
 * @param params.useTransition If the language change should use a transition
 * @returns The language button
 */
export const LanguageButton = ({ useTransition }: { useTransition: boolean }) => (
	<Popover position="bottom-end" withArrow>
		<Popover.Target>
			<ActionIcon loading={useTransition && _isLanguageLoading.value}>
				<Languages />
			</ActionIcon>
		</Popover.Target>
		<Popover.Dropdown p={8}>
			<Vertical gap={8}>
				{LANGUAGES.map((language) => (
					<Button
						key={language}
						onClick={setLanguageFn(language, useTransition)}
						variant={language === gs.language.value ? "filled" : "light"}
					>
						{LanguageDisplay[language]}
					</Button>
				))}
			</Vertical>
		</Popover.Dropdown>
	</Popover>
);

/**
 * A button that changes the language of the application
 * @param params
 * @param params.useTransition If the language change should use a transition
 * @returns The language button
 */
export const LanguageButton2 = ({ useTransition }: { useTransition: boolean }) => (
	<Select
		label="Language"
		data={LANGUAGES.map((language) => ({ value: language, label: LanguageDisplay[language] }))}
		value={gs.language.value}
		onChange={(value) => setLanguageFn(value as LanguageType, useTransition)()}
		allowDeselect={false}
		comboboxProps={{ withinPortal: false }}
	/>
);
