import { ActionIcon, Button, Popover } from "@mantine/core";
import { Languages } from "lucide-react";
import { flushSync } from "preact/compat";
import { LANGUAGES, type LanguageType } from "../Common/CommonModel";
import { _isLanguageLoading, globalState } from "../context/GlobalState";
import { Vertical } from "../utils/ComponentToolbox";

const LanguageDisplay: Record<LanguageType, string> = {
	en: "English",
	fr: "Français",
};

/**
 * A button that changes the language of the application
 * @param params Parameters
 * @param params.useTransition If the language change should use a transition
 * @param params.onClick On click event
 * @returns The language button
 */
export const LanguageButton = ({
	useTransition,
	onClick,
}: {
	useTransition: boolean;
	onClick?: (language: LanguageType) => void;
}) => {
	const setLanguageFn = (language: LanguageType) => () => {
		if (useTransition) {
			document.startViewTransition(() => flushSync(() => void ((globalState.language.value = language), onClick?.(language))));
		} else {
			setTimeout(() => void ((globalState.language.value = language), onClick?.(language)), 100);
		}
	};

	return (
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
							onClick={setLanguageFn(language)}
							variant={language === globalState.language.value ? "filled" : "light"}
						>
							{LanguageDisplay[language]}
						</Button>
					))}
				</Vertical>
			</Popover.Dropdown>
		</Popover>
	);
};
