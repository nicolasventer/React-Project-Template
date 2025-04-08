import type { TypedOmit } from "@/Shared/SharedUtils";
import { Checkbox, MultiSelect, type MultiSelectProps } from "@mantine/core";
import { useCallback, useMemo, useRef, useState } from "react";

const SELECT_ALL = "(Select all)" as const;

export type EnhancedMultiSelectProps = TypedOmit<
	MultiSelectProps,
	"data" | "value" | "onChange" | "searchValue" | "onSearchChange" | "filter"
> & {
	data: readonly (string | { value: string; label: string; disabled?: boolean })[];
	getLabel?: (item: string) => string;
	value: string[];
	onChange: (value: string[]) => void;
	/**
	 * The maximum number of items to display in the PillsInput (default: 4). \
	 * If the number of selected items is greater than this number, the number of selected items will be displayed instead.
	 */
	maxItemDisplayCount?: number;
	/** Whether to allow arbitrary values. */
	freeSolo?: boolean;
};

export const EnhancedMultiSelect = ({
	data,
	getLabel = (item) => item,
	value,
	onChange,
	maxItemDisplayCount = 4,
	renderOption: RenderOption,
	limit,
	freeSolo,
	selectFirstOptionOnChange,
	...props
}: EnhancedMultiSelectProps) => {
	const displayedValue = useMemo(
		() => (value.length <= maxItemDisplayCount ? value.map(getLabel) : [`${value.length} selected`]),
		[getLabel, maxItemDisplayCount, value]
	);
	const [searchValue, setSearchValue_] = useState("");
	const oldSearchValue = useRef(searchValue);
	const setSearchValue = useCallback(
		(v: string) => {
			oldSearchValue.current = searchValue;
			setSearchValue_(v);
		},
		[searchValue]
	);

	const realSelectFirstOptionOnChange = useMemo(
		() => oldSearchValue.current !== searchValue && selectFirstOptionOnChange,
		[searchValue, selectFirstOptionOnChange]
	);

	const getValue = (item: string | { value: string; label: string; disabled?: boolean }) =>
		typeof item === "string" ? item : item.value;

	const filteredData = useMemo(
		() =>
			data.filter((item) => item !== SELECT_ALL && getLabel(getValue(item)).toLowerCase().includes(searchValue.toLowerCase())),
		[data, getLabel, searchValue]
	);
	const isAllSelected = useMemo(() => filteredData.every((item) => value.includes(getValue(item))), [filteredData, value]);
	const isSomeSelected = useMemo(() => filteredData.some((item) => value.includes(getValue(item))), [filteredData, value]);

	const freeSoloData = useMemo(
		() => (freeSolo && searchValue && !filteredData.includes(searchValue) ? [searchValue] : [SELECT_ALL]),
		[freeSolo, searchValue, filteredData]
	);

	return (
		<MultiSelect
			data={[...freeSoloData, ...data]}
			value={displayedValue}
			searchValue={searchValue}
			onSearchChange={setSearchValue}
			filter={() =>
				(filteredData.length > 0 ? [...freeSoloData, ...filteredData.slice(0, limit)] : freeSoloData).map((d) =>
					typeof d === "string"
						? {
								label: d,
								value: d,
						  }
						: d
				)
			}
			renderOption={({ option }) => (
				<Checkbox
					checked={option.label === SELECT_ALL ? isAllSelected : value.includes(option.value)}
					indeterminate={option.label === SELECT_ALL ? !isAllSelected && isSomeSelected : undefined}
					label={
						option.label === SELECT_ALL ? (
							SELECT_ALL
						) : RenderOption ? (
							<RenderOption option={option} checked={value.includes(option.value)} />
						) : (
							getLabel(option.label)
						)
					}
					readOnly
					style={{ pointerEvents: "none" }}
					styles={{ inner: { alignSelf: "center" } }}
				/>
			)}
			onOptionSubmit={(v) => {
				if (v === SELECT_ALL) {
					if (isAllSelected) onChange(value.filter((item) => !filteredData.includes(getValue(item))));
					else onChange(Array.from(new Set([...value, ...filteredData.map(getValue)])));
				} else if (value.includes(v)) onChange(value.filter((item) => item !== v));
				else onChange([...value, v]);
			}}
			onRemove={(v) => (value.includes(v) ? onChange(value.filter((item) => item !== v)) : onChange(value.slice(0, -1)))}
			onClear={() =>
				searchValue
					? setSearchValue("")
					: onChange(data.filter((item) => typeof item === "object" && item.disabled).map(getValue))
			}
			selectFirstOptionOnChange={realSelectFirstOptionOnChange}
			{...props}
		/>
	);
};
