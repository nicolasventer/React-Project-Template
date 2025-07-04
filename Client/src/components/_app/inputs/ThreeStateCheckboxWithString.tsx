import type { ThreeStateCheckboxProps } from "@/components/_app/inputs/ThreeStateCheckbox";
import { ThreeStateCheckbox } from "@/components/_app/inputs/ThreeStateCheckbox";
import type { TypedOmit } from "@/Shared/SharedUtils";

export const ThreeStateCheckboxWithString = ({
	checked,
	setChecked,
	...props
}: TypedOmit<ThreeStateCheckboxProps, "checked" | "setChecked"> & {
	checked: string[];
	setChecked: (checked: string[]) => void;
}) => (
	<ThreeStateCheckbox
		checked={checked?.[0] ? checked[0] === "true" : null}
		setChecked={(checked) => setChecked(checked === null ? [] : [checked.toString()])}
		{...props}
	/>
);
