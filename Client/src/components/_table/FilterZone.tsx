import { actions, computedSt, st } from "@/actions/actions.impl";
import { DraggableList } from "@/components/_app/inputs/draggableList/DraggableList";
import { TOOLTIP_IDS } from "@/components/_app/tooltip.utils";
import { SortButton } from "@/components/_table/SortButton";
import type { TableUtils } from "@/components/_table/tableUtils.types";
import { VIEW_TYPES, type ViewType } from "@/Shared/SharedModel";
import { Box, Horizontal, Vertical } from "@/utils/ComponentToolbox";
import { SwitchV } from "@/utils/MultiIf";
import type { ColumnState } from "@/utils/TableUtils/ColumnManager";
import type { ColumnPinningManager, ColumnPinningState, ColumnPinningType } from "@/utils/TableUtils/ColumnPinningManager";
import type { SortManager, SortState } from "@/utils/TableUtils/SortManager";
import { ActionIcon, Button, Indicator, LoadingOverlay, Popover, SegmentedControl, Switch, TagsInput, Text } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import { computed, signal } from "@preact/signals";
import { ArrowUpNarrowWide, Filter, LayoutGrid, RefreshCcw, Sheet, WholeWord, X } from "lucide-react";
import { useMemo, useRef, type ChangeEvent, type ReactNode } from "react";
import toast from "react-hot-toast";
import { BsPinFill } from "react-icons/bs";
import { TfiLayoutColumn3Alt } from "react-icons/tfi";

const VIEWS_ICONS_OBJ: Record<ViewType, ReactNode> = {
	card: <LayoutGrid size={12} data-tooltip-id={TOOLTIP_IDS.main} data-tooltip-content="Card view" />,
	table: <Sheet size={12} data-tooltip-id={TOOLTIP_IDS.main} data-tooltip-content="Table view" />,
};

const ViewRender = () => (
	<div style={{ position: "relative" }}>
		<SegmentedControl
			data={VIEW_TYPES.map((view) => ({ value: view, label: VIEWS_ICONS_OBJ[view] }))}
			size={computedSt.xsSm.value}
			style={{ border: `solid 1px ${st.colorScheme.current.value === "dark" ? "#424242" : "#d0d4d9"}` }}
			value={st.view.current.value}
			onChange={(value) => actions.view.update(value as ViewType)}
		/>
		<LoadingOverlay visible={st.view.isLoading.value} />
	</div>
);

const RenderFn = ({ children: Children }: { children: () => ReactNode }) => <Children />;

const FilterInput = ({
	filterCategories,
	activeFilterCategory,
	setActiveFilterCategoryFn,
	searchValue,
	setSearchValue,
	value,
	onValueChange,
	resetToDefaultFilters,
	clearAllFilters,
	activeFilters,
	handleFilterChangeFn,
	FilterDropdown,
	FilterValueRender,
}: {
	filterCategories: { value: string; label: string }[];
	activeFilterCategory: { value: string; label: string } | undefined;
	setActiveFilterCategoryFn: (value: string | undefined) => () => void;
	searchValue: string;
	setSearchValue: (value: string) => void;
	value: string[];
	onValueChange: (value: string[]) => void;
	resetToDefaultFilters: () => void;
	clearAllFilters: () => void;
	activeFilters: { key: string; label: string; value: string }[];
	handleFilterChangeFn: (key: string) => (value: string | string[]) => void;
	FilterDropdown: (props: { filterKey: string }) => ReactNode;
	FilterValueRender: Partial<Record<string | "global", () => ReactNode>>;
}) => {
	const { ref: leftSectionRef, width: leftSectionWidth } = useElementSize();
	const tagsInputRef = useRef<HTMLInputElement>(null);
	const focusGlobalFilter = () => {
		tagsInputRef.current?.focus();
		toast.success("Global filter focused");
	};

	return (
		<TagsInput
			ref={tagsInputRef}
			placeholder={'Filter (@ for category, " for space escape)'}
			style={{ flexGrow: 1 }}
			clearable
			styles={{
				input: {
					paddingLeft: leftSectionWidth,
					display: activeFilterCategory ? "none" : undefined,
				},
				pillsList: {
					paddingLeft: 18,
				},
			}}
			classNames={{ inputField: "custom-mantine-placeholder" }}
			size={computedSt.xsSm.value}
			data={searchValue.startsWith("@") ? filterCategories : []}
			searchValue={searchValue}
			onSearchChange={setSearchValue}
			value={value}
			onChange={onValueChange}
			leftSectionWidth={activeFilterCategory ? "100%" : "auto"}
			leftSectionProps={{ style: { backgroundColor: "var(--mantine-color-body)" } }}
			leftSection={
				<Box widthFull padding="0 6px" ref={leftSectionRef}>
					<Horizontal gap={6} widthFull={!!activeFilterCategory}>
						<ActionIcon
							variant={st.isWholeWordFilter.value ? "filled" : "outline"}
							size="xs"
							onClick={actions.wholeWordFilter.toggle}
							data-tooltip-id={TOOLTIP_IDS.main}
							data-tooltip-content={st.isWholeWordFilter.value ? "Whole word filter" : "Partial word filter"}
						>
							<WholeWord />
						</ActionIcon>
						{activeFilterCategory && (
							<>
								<Popover
									withArrow
									position="bottom-start"
									opened
									closeOnClickOutside
									onDismiss={setActiveFilterCategoryFn(undefined)}
								>
									<Popover.Target>
										<Text size={computedSt.xsSm.value} className="ellipsis-text">
											{activeFilterCategory.label.slice(1)}
										</Text>
									</Popover.Target>
									<Popover.Dropdown>
										<FilterDropdown filterKey={activeFilterCategory.value} />
									</Popover.Dropdown>
								</Popover>
								<Box />
								<Button
									size={computedSt.compactXsSm.value}
									onClick={setActiveFilterCategoryFn(undefined)}
									style={{ flexGrow: 1 }}
									color="orange.8"
									variant="light"
								>
									Close {activeFilterCategory.label.slice(1)} filter
								</Button>
							</>
						)}
					</Horizontal>
				</Box>
			}
			rightSectionWidth="auto"
			rightSectionProps={{ style: { backgroundColor: "var(--mantine-color-body)", paddingLeft: 6 } }}
			rightSection={
				<Popover withArrow position="bottom-end" shadow="xl">
					<Popover.Target>
						<div style={{ marginTop: 8, marginRight: 8 }}>
							<Indicator label={activeFilters.length} size={16} disabled={activeFilters.length === 0}>
								<ActionIcon size={20} variant="subtle">
									<Filter
										fill={activeFilters.length ? "var(--mantine-color-chabe-red-filled)" : "transparent"}
										stroke={activeFilters.length ? "var(--mantine-color-chabe-red-filled)" : "currentColor"}
									/>
								</ActionIcon>
							</Indicator>
						</div>
					</Popover.Target>
					<Popover.Dropdown>
						<Vertical gap={6}>
							{activeFilters.map((filter) => (
								<Horizontal key={filter.label} gap={6} widthFull justifyContent="space-between">
									<div style={{ width: 130 }}>
										{filter.key === "global" ? (
											<Button size={computedSt.compactXsSm.value} maw={130} onClick={focusGlobalFilter}>
												<div className="ellipsis-text">{filter.label}</div>
											</Button>
										) : (
											<Popover withArrow position="bottom-end" withinPortal={false} shadow="xl">
												<Popover.Target>
													<Button size={computedSt.compactXsSm.value} maw={130}>
														<div className="ellipsis-text">{filter.label}</div>
													</Button>
												</Popover.Target>
												<Popover.Dropdown style={{ minWidth: "max-content" }}>
													<FilterDropdown filterKey={filter.key} />
												</Popover.Dropdown>
											</Popover>
										)}
									</div>
									<RenderFn>
										{FilterValueRender[filter.key] ??
											(() => (
												<Text size={computedSt.xsSm.value} style={{ overflow: "auto", textWrap: "nowrap", flexGrow: 1 }}>
													{filter.value}
												</Text>
											))}
									</RenderFn>
									<div>
										{computedSt.isBelowXxs.value ? (
											<ActionIcon
												variant="light"
												size={computedSt.xsSm.value}
												onClick={() => handleFilterChangeFn(filter.key)([])}
											>
												<X />
											</ActionIcon>
										) : (
											<Button
												size={computedSt.compactXsSm.value}
												onClick={() => handleFilterChangeFn(filter.key)([])}
												variant="light"
											>
												Clear
											</Button>
										)}
									</div>
								</Horizontal>
							))}
							<Box marginTop={3} />
							<Horizontal justifyContent="space-between" gap={6}>
								<Button size={computedSt.compactXsSm.value} onClick={resetToDefaultFilters} variant="light">
									Reset to default
								</Button>
								{activeFilters.length !== 0 && (
									<Button size={computedSt.compactXsSm.value} onClick={clearAllFilters} variant="light" color="chabe-red">
										Clear all filters
									</Button>
								)}
							</Horizontal>
						</Vertical>
					</Popover.Dropdown>
				</Popover>
			}
		/>
	);
};

const ColumnDisplayer = <T extends string>({
	columnPinningManager,
	columnPinningState,
	orderedColumnState,
	resetToDefaultColumns,
	updatePinningStateFn,
	updateIsVisibleFn,
	getLabel,
	updateColumnState,
}: {
	columnPinningManager: ColumnPinningManager<T>;
	columnPinningState: ColumnPinningState<T>;
	orderedColumnState: ColumnState<T>;
	resetToDefaultColumns: () => void;
	updatePinningStateFn: (key: T, pinningType: ColumnPinningType) => () => void;
	updateIsVisibleFn: (key: T) => (ev: ChangeEvent<HTMLInputElement>) => void;
	getLabel: (key: T) => string;
	updateColumnState: (state: ColumnState<T>) => void;
}) => (
	<div>
		<Popover withArrow position="bottom-end">
			<Popover.Target>
				<ActionIcon variant="light" size="md">
					<TfiLayoutColumn3Alt size={16} />
				</ActionIcon>
			</Popover.Target>
			<Popover.Dropdown mah="calc(100dvh - 100px)" p="xs" style={{ overflow: "auto" }}>
				<Button variant="outline" size={computedSt.compactXsSm.value} onClick={resetToDefaultColumns}>
					Reset to default
				</Button>
				<Box marginTop={6} />
				<DraggableList
					data={orderedColumnState}
					getKey={(item) => item.key}
					handlePosition="right"
					Render={({ item }) => (
						<div style={{ margin: "2px 25px 2px 0" }}>
							<Horizontal gap={6}>
								<Horizontal gap={6} justifyContent="center" width={55}>
									<SwitchV
										value={columnPinningManager.getPinningType(columnPinningState, item.key)}
										cases={[
											[
												"none",
												() => (
													<>
														<ActionIcon
															variant="subtle"
															size="sm"
															style={{ transform: "rotate(90deg)" }}
															onClick={updatePinningStateFn(item.key, "left")}
														>
															<BsPinFill />
														</ActionIcon>
														<ActionIcon
															variant="subtle"
															size="sm"
															style={{ transform: "rotate(-90deg)" }}
															onClick={updatePinningStateFn(item.key, "right")}
														>
															<BsPinFill />
														</ActionIcon>
													</>
												),
											],
										]}
										defaultCase={() => (
											<ActionIcon variant="subtle" size="sm" onClick={updatePinningStateFn(item.key, "none")}>
												<BsPinFill />
											</ActionIcon>
										)}
									/>
								</Horizontal>
								<Switch
									size={computedSt.xsSm.value}
									label={getLabel(item.key)}
									checked={item.isVisible}
									onChange={updateIsVisibleFn(item.key)}
								/>
							</Horizontal>
						</div>
					)}
					onStateChanged={updateColumnState}
				/>
			</Popover.Dropdown>
		</Popover>
	</div>
);

const SortDisplayer = <T extends string>({
	orderedSortKeys,
	resetToDefaultSort,
	getLabel,
	updateSortState,
	sortManager,
	sortState,
}: {
	orderedSortKeys: T[];
	resetToDefaultSort: () => void;
	getLabel: (key: T) => string;
	updateSortState: (state: SortState<T>) => void;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	sortManager: SortManager<T, any>;
	sortState: SortState<T>;
}) => (
	<div>
		<Popover withArrow position="bottom-end">
			<Popover.Target>
				<ActionIcon variant="light" size="md">
					<ArrowUpNarrowWide size={16} />
				</ActionIcon>
			</Popover.Target>
			<Popover.Dropdown mah="calc(100dvh - 100px)" p="xs" style={{ overflow: "auto" }}>
				<Vertical gap={3}>
					<div>
						<Button variant="outline" size={computedSt.compactXsSm.value} onClick={resetToDefaultSort}>
							Reset to default
						</Button>
					</div>
					<div />
					<table>
						<tbody>
							{orderedSortKeys.map((column) => (
								<tr key={column}>
									<td>
										<SortButton
											key={column}
											sortManager={sortManager}
											sortState={sortState}
											setSortState={updateSortState}
											sortKey={column}
											displayType="sort"
										>
											{getLabel(column)}
										</SortButton>
									</td>
									<td>
										<Vertical alignItems="center">
											<SortButton
												key={column}
												sortManager={sortManager}
												sortState={sortState}
												setSortState={updateSortState}
												sortKey={column}
												displayType="lock"
											>
												{getLabel(column)}
											</SortButton>
										</Vertical>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</Vertical>
			</Popover.Dropdown>
		</Popover>
	</div>
);

export const FilterZone = <
	FilterKey extends string | "global",
	SortKey extends string,
	ColumnKey extends string,
	Data,
	ColumnValue extends { title: string; headerDropdown: () => ReactNode }
>({
	tableUtils,
	onRefresh,
	refreshLoading,
}: {
	tableUtils: TableUtils<FilterKey, SortKey, ColumnKey, Data, ColumnValue>;
	onRefresh: () => void;
	refreshLoading: boolean;
}) => {
	const {
		columnPinningManager,
		columnPinningState,
		sortManager,
		sortState,
		orderedColumnState,
		filterState,
		FilterValueRender,
		handleFilterChangeFn,
		updateSortState,
		updateColumnState,
		updateIsVisibleFn,
		updatePinningStateFn,
		clearAllFilters,
		resetToDefaultFilters,
		resetToDefaultSort,
		resetToDefaultColumns,
		getLabel,
		FilterDropdown,
		orderedSortKeys,
		activeFilters,
		filterCategories,
		searchValue,
		updateSearchValue,
		onValueChange,
		activeFilterCategory,
		setActiveFilterCategoryFn,
	} = useMemo(() => {
		const {
			columnManager: _columnManager,
			columnPinningManager,
			filterManager,
			sortManager,
			sortState,
			columnState,
			columnPinningState,
			orderedColumnState,
			filterState,
			FILTER_DEFAULT_STATE,
			SORT_DEFAULT_STATE,
			COLUMN_DEFAULT_STATE,
			PINNING_DEFAULT_STATE,
			FilterValueRender,
			handleFilterChangeFn,
			onClearOrResetAllFilters,
		} = tableUtils;

		const updateSortState = (state: SortState<SortKey>) => void (sortState.value = state);
		const updateColumnState = (state: ColumnState<ColumnKey>) => void (columnState.value = state);
		const updateIsVisibleFn = (key: ColumnKey) => (ev: ChangeEvent<HTMLInputElement>) =>
			(columnState.value = columnState.value.map((column) =>
				column.key === key ? { key, isVisible: ev.target.checked } : column
			));
		const updatePinningStateFn = (key: ColumnKey, pinningType: ColumnPinningType) => () =>
			(columnPinningState.value = columnPinningManager.setPinningState(columnPinningState.value, key, pinningType));

		const clearAllFilters = () => {
			filterState.value = {};
			onClearOrResetAllFilters("clear");
		};
		const resetToDefaultFilters = () => {
			filterState.value = FILTER_DEFAULT_STATE;
			onClearOrResetAllFilters("default");
		};
		const resetToDefaultSort = () => void (sortState.value = [...SORT_DEFAULT_STATE]);
		const resetToDefaultColumns = () => {
			sortState.value = [...SORT_DEFAULT_STATE];
			columnState.value = [...COLUMN_DEFAULT_STATE];
			columnPinningState.value = [...PINNING_DEFAULT_STATE];
		};

		const getLabel = (key: ColumnKey) => _columnManager.columns[key].title;
		const getFilterLabel = (key: ColumnKey) => (key === "global" ? "Global" : _columnManager.columns[key].title);
		const FilterDropdown = ({ filterKey }: { filterKey: ColumnKey }) => {
			const HeaderDropdown = useMemo(
				() => (filterKey === "global" ? () => null : _columnManager.columns[filterKey].headerDropdown),
				[filterKey]
			);
			return <HeaderDropdown />;
		};

		const sortKeys = sortManager.getAllKeys();
		const orderedSortKeys = computed(
			() =>
				orderedColumnState.value
					.filter((column) => sortKeys.includes(column.key as unknown as SortKey))
					.map((column) => column.key) as unknown as SortKey[]
		);

		const activeFilters = computed(() =>
			filterManager
				.getAllKeys()
				.filter((key) => filterManager.isFilterActive(filterState.value, key))
				.map((key) => ({ key, label: getFilterLabel(key as ColumnKey), value: (filterState.value[key] ?? []).join(", ") }))
		);
		const filterCategories = computed(() =>
			filterManager
				.getAllKeys()
				.filter((key) => key !== "global")
				.map((key) => ({ value: key, label: `@${getFilterLabel(key as ColumnKey)}` }))
		);

		const searchValue = signal("");
		const updateSearchValue = (newSearchValue: string) => {
			searchValue.value = newSearchValue;
			if (newSearchValue.startsWith("@")) return;
			const trimmedValue = newSearchValue.trim();
			if (trimmedValue.startsWith('"')) {
				if (trimmedValue.slice(1).endsWith('"')) {
					searchValue.value = "";
					onValueChange([...(filterState.value.global ?? []), trimmedValue.slice(1, -1)]);
				}
			} else if (newSearchValue.endsWith(" ") && trimmedValue.length > 1) {
				searchValue.value = "";
				onValueChange([...(filterState.value.global ?? []), trimmedValue]);
			}
		};
		const onValueChange = (value: string[]) => {
			setActiveFilterCategoryFn(value[value.length - 1])();
			if (!activeFilterCategory.value) handleFilterChangeFn("global")(value);
		};
		const activeFilterCategory = signal<{ value: FilterKey | "global"; label: string }>();
		const setActiveFilterCategoryFn = (value: string | undefined) => () =>
			void (activeFilterCategory.value = value
				? filterCategories.peek().find((category) => category.label === value)
				: undefined);

		return {
			columnPinningManager,
			columnPinningState,
			sortManager,
			sortState,
			orderedColumnState,
			filterState,
			FilterValueRender,
			handleFilterChangeFn,
			updateSortState,
			updateColumnState,
			updateIsVisibleFn,
			updatePinningStateFn,
			clearAllFilters,
			resetToDefaultFilters,
			resetToDefaultSort,
			resetToDefaultColumns,
			getLabel,
			FilterDropdown,
			orderedSortKeys,
			activeFilters,
			filterCategories,
			searchValue,
			updateSearchValue,
			onValueChange,
			activeFilterCategory,
			setActiveFilterCategoryFn,
		};
	}, [tableUtils]);

	return (
		<Horizontal gap={6}>
			{st.loginOutput.value?.role === "Coordinator" && <ViewRender />}
			<FilterInput
				filterCategories={filterCategories.value}
				activeFilterCategory={activeFilterCategory.value}
				setActiveFilterCategoryFn={setActiveFilterCategoryFn}
				searchValue={searchValue.value}
				setSearchValue={updateSearchValue}
				value={filterState.value.global ?? []}
				onValueChange={onValueChange}
				resetToDefaultFilters={resetToDefaultFilters}
				clearAllFilters={clearAllFilters}
				activeFilters={activeFilters.value}
				handleFilterChangeFn={(key) => handleFilterChangeFn(key as FilterKey)}
				FilterDropdown={FilterDropdown as (props: { filterKey: string }) => ReactNode}
				FilterValueRender={FilterValueRender}
			/>
			{st.view.current.value === "table" || st.loginOutput.value?.role !== "Coordinator" ? (
				<ColumnDisplayer
					columnPinningManager={columnPinningManager}
					columnPinningState={columnPinningState.value}
					orderedColumnState={orderedColumnState.value}
					resetToDefaultColumns={resetToDefaultColumns}
					updatePinningStateFn={updatePinningStateFn}
					getLabel={getLabel}
					updateIsVisibleFn={updateIsVisibleFn}
					updateColumnState={updateColumnState}
				/>
			) : (
				<SortDisplayer
					orderedSortKeys={orderedSortKeys.value}
					resetToDefaultSort={resetToDefaultSort}
					getLabel={getLabel as unknown as (key: SortKey) => string}
					sortManager={sortManager}
					sortState={sortState.value}
					updateSortState={updateSortState}
				/>
			)}
			<div>
				<ActionIcon variant="light" size="md" onClick={onRefresh} loading={refreshLoading}>
					<RefreshCcw size={16} />
				</ActionIcon>
			</div>
		</Horizontal>
	);
};
