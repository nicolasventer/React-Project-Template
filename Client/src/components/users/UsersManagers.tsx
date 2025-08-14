import { actions } from "@/actions/actions.impl";
import { EnhancedMultiSelectWithDefault } from "@/components/_app/inputs/EnhancedMultiSelectWithDefault";
import type { FilterHeaderProps } from "@/components/_table/FilterHeader";
import { FilterHeader } from "@/components/_table/FilterHeader";
import type { SortButtonProps } from "@/components/_table/SortButton";
import type { RoleType, UserOutput } from "@/Shared/SharedModel";
import { ROLES } from "@/Shared/SharedModel";
import type { TypedOmit } from "@/Shared/SharedUtils";
import { Box, Horizontal } from "@/utils/ComponentToolbox";
import { ColumnManager } from "@/utils/TableUtils/ColumnManager";
import { FilterManager, FilterUtils } from "@/utils/TableUtils/FilterManager";
import { SortManager, SortUtils } from "@/utils/TableUtils/SortManager";
import { Button, RangeSlider, Select } from "@mantine/core";
import dayjs from "dayjs";
import type { MouseEventHandler, ReactNode } from "react";

export const userSortManager = new SortManager({
	email: (a: UserOutput, b) => SortUtils.StringOrNullComparer(a.email, b.email),
	role: (a, b) => SortUtils.StringOrNullComparer(a.role, b.role),
	lastLoginTime: (a, b) => SortUtils.NumberOrNullComparer(a.lastLoginTime, b.lastLoginTime),
});

export type UserSortKey = typeof userSortManager.types.key;
export type UserSortState = typeof userSortManager.types.sortState;

export const userFilterManager = new FilterManager({
	email: FilterUtils.textFilterFn("or", (user: UserOutput) => user.email),
	role: FilterUtils.textFilterFn("or", (user: UserOutput) => user.role),
	lastLoginTime: (data: UserOutput, values) => {
		for (let i = 0; i < values.length; i += 2) {
			const min = Number(values[i]);
			const max = Number(values[i + 1]);
			if (data.lastLoginTime >= min && data.lastLoginTime <= max) return true;
		}
		return false;
	},
});

export type UserFilterKey = typeof userFilterManager.types.key;
export type UserFilterState = typeof userFilterManager.types.filterState;

const formatTime = (time: number) => dayjs(time).fromNow();

type HeaderRenderProps = {
	sortState: UserSortState;
	filterState: UserFilterState;
	isAboveMd: boolean;
	isSortAdditive: boolean;
	children: ReactNode;
	// additional props
	lastLoginTimeOptions: string[];
};

const getSortValue = (sortKey: UserSortKey, sortState: UserSortState): SortButtonProps["sortValue"] => {
	const sortIndex = sortState.findIndex((sort) => sort.key === sortKey);
	return sortIndex !== -1 ? { value: sortState[sortIndex].asc, index: sortIndex } : undefined;
};

const toggleSortFn =
	(sortKey: UserSortKey, sortState: UserSortState, isSortAdditive: boolean): MouseEventHandler<HTMLButtonElement> =>
	(ev) =>
		actions.users.sortState.update(userSortManager.toggleSortState(sortState, sortKey, ev.ctrlKey || isSortAdditive));

const getFilterHeaderProps = (
	{ sortState, filterState, isAboveMd, isSortAdditive, children }: HeaderRenderProps,
	key: UserSortKey
): TypedOmit<FilterHeaderProps, "title" | "tooltip"> => ({
	toggleSort: toggleSortFn(key, sortState, isSortAdditive),
	sortValue: getSortValue(key, sortState),
	bShowSortIndex: sortState.length > 1,
	isSortAdditive,
	isAboveMd,
	isFilterActive: !!filterState[key]?.length,
	children,
});

type FilterRenderProps = {
	options: string[];
	filterState: UserFilterState;
};

const getEnhancedMultiSelectProps = ({ options, filterState }: FilterRenderProps, key: UserFilterKey) => ({
	data: options,
	value: filterState[key] ?? [],
	onChange: (value: string[]) => actions.users.filterState.update({ ...filterState, [key]: value }),
});

export const userColumnManager = new ColumnManager<
	UserFilterKey | "actions",
	{
		key: UserFilterKey | "actions";
		headerRender: (props: HeaderRenderProps) => React.ReactNode;
		filterRender: (props: FilterRenderProps) => React.ReactNode;
		render: (props: { user: UserOutput; editedUser: UserOutput | null; token: string }) => React.ReactNode;
	}
>({
	email: {
		key: "email",
		headerRender: (props) => <FilterHeader title="Email" {...getFilterHeaderProps(props, "email")} />,
		filterRender: ({ options, filterState }) => (
			<EnhancedMultiSelectWithDefault {...getEnhancedMultiSelectProps({ options, filterState }, "email")} />
		),
		render: ({ user, editedUser }) => editedUser?.email ?? user.email,
	},
	role: {
		key: "role",
		headerRender: (props) => <FilterHeader title="Role" {...getFilterHeaderProps(props, "role")} />,
		filterRender: ({ options, filterState }) => (
			<EnhancedMultiSelectWithDefault {...getEnhancedMultiSelectProps({ options, filterState }, "role")} />
		),
		render: ({ user, editedUser }) => (
			<Select
				data={ROLES}
				value={editedUser?.role ?? user.role}
				onChange={(value) => actions.users.edited.role.update(user.userId, value as RoleType)}
				size="xs"
				clearable={false}
			/>
		),
	},
	lastLoginTime: {
		key: "lastLoginTime",
		headerRender: (props) => (
			<FilterHeader
				title="Last Login"
				{...getFilterHeaderProps(props, "lastLoginTime")}
				isFilterActive={
					props.filterState.lastLoginTime?.length === 2 &&
					(props.filterState.lastLoginTime[0] !== props.lastLoginTimeOptions[0] ||
						props.filterState.lastLoginTime[1] !== props.lastLoginTimeOptions[1])
				}
			/>
		),
		filterRender: ({ options, filterState }) => (
			<Box width={300} padding="0px 35px 15px 35px">
				<RangeSlider
					min={Number(options[0]) || 0}
					max={Number(options[1]) || 0}
					value={[
						Number(filterState.lastLoginTime?.[0]) || Number(options[0]) || 0,
						Number(filterState.lastLoginTime?.[1]) || Number(options[1]) || 0,
					]}
					marks={options.map((option) => ({ value: Number(option), label: formatTime(Number(option)) }))}
					label={formatTime}
					onChange={(value) =>
						actions.users.filterState.update({ ...filterState, lastLoginTime: [value[0].toString(), value[1].toString()] })
					}
				/>
			</Box>
		),
		render: ({ user, editedUser }) => formatTime(editedUser?.lastLoginTime ?? user.lastLoginTime),
	},
	actions: {
		key: "actions",
		headerRender: () => <th>Actions</th>,
		filterRender: () => null,
		render: ({ user, editedUser, token }) => (
			<Horizontal gap={6}>
				<Button onClick={actions.users.edited.saveFn(token, editedUser!)} disabled={!editedUser}>
					Save
				</Button>
				<Button onClick={actions.users.edited.cancelFn(user.userId)} color="red" disabled={!editedUser}>
					Cancel
				</Button>
			</Horizontal>
		),
	},
});

export type UserColumnKey = typeof userColumnManager.types.key;
export type UserColumnState = typeof userColumnManager.types.columnState;
export type UserColumnValue = typeof userColumnManager.types.value;
