import { InputProps } from "@mantine/core";
import { ChevronsUpDown } from "lucide-react";
import CustomSelectCss from "./CustomSelect.module.css";

/** The default props for the custom select input. */
export const CustomSelectDefaultValueProps: InputProps = {
	/** The left section of the input. */
	leftSection: true,
	/** The width of the left section. */
	leftSectionWidth: 10,
	/** The right section of the input. */
	rightSection: <ChevronsUpDown width={14} />,
	/** The width of the right section. */
	rightSectionWidth: 24,
	/** The class names of the input. */
	classNames: { input: CustomSelectCss.input },
};

/** The props for the custom select option input. */
export const CustomSelectOptionProps: InputProps = {
	/** The left section of the input. */
	rightSectionWidth: 30,
	/** The class names of the input. */
	classNames: { input: CustomSelectCss["input-option"] },
	/** The variant of the input. */
	variant: "unstyled",
};
