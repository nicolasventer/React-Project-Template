import type { TypedOmit } from "@/Shared/SharedUtils";
import { Checkbox, type CheckboxProps } from "@mantine/core";

export const ThreeStateCheckbox = ({
	checked,
	setChecked,
	...props
}: TypedOmit<CheckboxProps, "indeterminate" | "checked" | "onChange"> & {
	checked: boolean | null;
	setChecked: (checked: boolean | null) => void;
}) => (
	<Checkbox
		indeterminate={checked === null}
		checked={!!checked}
		onChange={(ev) => setChecked(ev.currentTarget.checked ? (checked === null ? true : null) : false)}
		{...props}
	/>
);
