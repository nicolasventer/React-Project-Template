import type { EnhancedMultiSelectProps } from "@/components/_app/inputs/EnhancedMultiSelect";
import { EnhancedMultiSelect } from "@/components/_app/inputs/EnhancedMultiSelect";

/** Shorthand for a {@link EnhancedMultiSelect} component with default props (like clearable, searchable, ...). */
export const EnhancedMultiSelectWithDefault = (multiSelectProps: EnhancedMultiSelectProps) => (
	<EnhancedMultiSelect
		clearable
		searchable
		autoFocus
		nothingFoundMessage="Nothing found..."
		selectFirstOptionOnChange
		comboboxProps={{ withinPortal: false }}
		{...multiSelectProps}
	/>
);
