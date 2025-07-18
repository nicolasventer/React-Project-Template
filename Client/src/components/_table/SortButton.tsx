import { actions } from "@/actions/actions.impl";
import { ActionIcon, Button } from "@mantine/core";
import { ArrowUpDown, Lock, LockOpen, MoveDown, MoveUp } from "lucide-react";
import type { MouseEventHandler, ReactNode } from "react";

export type SortButtonProps = {
	toggleSort: MouseEventHandler<HTMLButtonElement>;
	sortValue: { value: boolean; index: number } | undefined;
	bShowSortIndex: boolean;
	isSortAdditive: boolean;
	displayType?: "all" | "sort" | "lock"; // default is all
	isAboveMd: boolean;
	children?: ReactNode;
};

export const SortButton = ({
	toggleSort,
	sortValue,
	bShowSortIndex,
	isSortAdditive,
	displayType = "all",
	isAboveMd,
	children,
	...props
}: SortButtonProps) => {
	return (
		<>
			{displayType !== "lock" && (
				<Button
					fullWidth
					justify="space-between"
					rightSection={
						<>
							{sortValue?.value ? (
								<MoveUp size={16} />
							) : sortValue?.value === false ? (
								<MoveDown size={16} />
							) : (
								<ArrowUpDown strokeOpacity={0.2} size={16} />
							)}
							{bShowSortIndex && sortValue?.index !== undefined ? (sortValue.index + 1).toString() : ""}
						</>
					}
					variant={sortValue ? "light" : "subtle"}
					color={sortValue ? "blue.8" : undefined}
					size={isAboveMd ? "compact-sm" : "compact-xs"}
					onClick={toggleSort}
					{...props}
				>
					{children}
				</Button>
			)}
			{displayType !== "sort" && sortValue && (
				<ActionIcon variant="subtle" size={isAboveMd ? "compact-sm" : "compact-xs"} onClick={actions.users.sortAdditive.toggle}>
					{isSortAdditive ? <Lock size={16} /> : <LockOpen size={16} />}
				</ActionIcon>
			)}
		</>
	);
};
