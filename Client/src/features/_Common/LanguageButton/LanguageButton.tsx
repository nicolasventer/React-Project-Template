import { setLanguageFn } from "@/features/_Common/common.setters";
import { gs, isLanguageLoading } from "@/gs";
import { Vertical } from "@/libs/StrongBox/ComponentToolbox";
import { LANGUAGES, type LanguageType } from "@/Shared/SharedModel";
import { ActionIcon, Button, Popover, Select } from "@mantine/core";
import { Languages } from "lucide-react";

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
			<ActionIcon loading={useTransition && isLanguageLoading.value}>
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
		disabled={isLanguageLoading.value}
	/>
);
