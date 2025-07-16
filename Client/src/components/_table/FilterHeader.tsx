import { TOOLTIP_IDS } from "@/components/_app/tooltipIds";
import type { SortButtonProps } from "@/components/_table/SortButton";
import { SortButton } from "@/components/_table/SortButton";
import { Horizontal, Vertical } from "@/utils/ComponentToolbox";
import { ActionIcon, Button, Indicator, Popover } from "@mantine/core";
import { Filter } from "lucide-react";
import type { ReactNode } from "react";

export type FilterHeaderProps = {
	title: ReactNode;
	tooltip?: string;
	children: ReactNode;
	isFilterActive: boolean;
	bCompact?: boolean;
} & SortButtonProps;

export const FilterHeader = ({
	title,
	tooltip,
	children,
	isFilterActive,
	toggleSort,
	sortValue,
	bShowSortIndex,
	isSortAdditive,
	isAboveMd,
	bCompact = false,
}: FilterHeaderProps) => (
	<th>
		{bCompact ? (
			<Popover withArrow position="bottom-end">
				<Popover.Target>
					<Indicator
						offset={5}
						size={10}
						color="red"
						disabled={!isFilterActive}
						zIndex="auto"
						inline
						data-tooltip-id={TOOLTIP_IDS.main}
						data-tooltip-content={tooltip}
					>
						<Button variant="subtle" size={isAboveMd ? "compact-sm" : "compact-xs"}>
							{title}
						</Button>
					</Indicator>
				</Popover.Target>
				<Popover.Dropdown>
					<Vertical gap={6}>
						<SortButton
							toggleSort={toggleSort}
							sortValue={sortValue}
							bShowSortIndex={bShowSortIndex}
							isSortAdditive={isSortAdditive}
							isAboveMd={isAboveMd}
						>
							{title}
						</SortButton>
						{children}
					</Vertical>
				</Popover.Dropdown>
			</Popover>
		) : (
			<Horizontal gap={1}>
				<SortButton
					toggleSort={toggleSort}
					sortValue={sortValue}
					bShowSortIndex={bShowSortIndex}
					isSortAdditive={isSortAdditive}
					isAboveMd={isAboveMd}
					data-tooltip-id={TOOLTIP_IDS.main}
					data-tooltip-content={tooltip}
				>
					{title}
				</SortButton>
				<Popover withArrow position="bottom-end">
					<Popover.Target>
						<ActionIcon variant="subtle">
							<Filter fill={isFilterActive ? "red" : "transparent"} stroke={isFilterActive ? "red" : "currentColor"} size={16} />
						</ActionIcon>
					</Popover.Target>
					<Popover.Dropdown>{children}</Popover.Dropdown>
				</Popover>
			</Horizontal>
		)}
	</th>
);
