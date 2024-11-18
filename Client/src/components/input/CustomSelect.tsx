import { Input, InputProps, Popover } from "@mantine/core";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { gs, xsSm } from "../../context/GlobalState";
import { Vertical } from "../../utils/ComponentToolbox";
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

/**
 * A custom select input component.
 * @param props - The component props.
 * @param props.data - The data to select from.
 * @param props.defaultValue - The default value.
 * @param props.valueProps - The value input props.
 * @param props.optionProps - The option input props.
 * @returns The custom select input component.
 */
export const CustomSelect = ({
	data,
	defaultValue,
	valueProps,
	optionProps,
}: {
	data: readonly string[];
	defaultValue: string;
	valueProps?: InputProps;
	optionProps?: InputProps;
}) => {
	const [opened, setOpened] = useState(false);
	const [value, setValue] = useState(defaultValue);

	return (
		<Popover opened={opened} onChange={setOpened}>
			<Popover.Target>
				<Input
					readOnly
					value={value}
					{...{ "data-value": value }}
					onClick={() => setOpened((o) => !o)}
					size={xsSm.value}
					w={gs.isAboveMd ? 110 : 90}
					{...CustomSelectDefaultValueProps}
					{...valueProps}
				/>
			</Popover.Target>
			<Popover.Dropdown p={0} w={gs.isAboveMd ? 110 : 90} style={{ zIndex: 6000 }}>
				<Vertical gap={5}>
					{data.map((item) => (
						<Input
							key={item}
							readOnly
							value={item}
							{...{ "data-value": item }}
							onClick={() => (setValue(item), setOpened(false))}
							rightSection={value === item && <Check width={14} stroke-width={4} />}
							size={xsSm.value}
							{...CustomSelectOptionProps}
							{...optionProps}
						/>
					))}
				</Vertical>
			</Popover.Dropdown>
		</Popover>
	);
};
