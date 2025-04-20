import { actions } from "@/actions/actions.impl";
import { mainContentStore } from "@/globalState";
import { Horizontal, Vertical } from "@/utils/ComponentToolbox";
import { ActionIcon, Affix, TableOfContents, Text, Transition } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { TableOfContentsIcon } from "lucide-react";
import { useEffect, useRef } from "react";

export const Aside = ({
	isAboveXl,
	isAsideOpened,
	isMainScrollable,
}: {
	isAboveXl: boolean;
	isAsideOpened: boolean;
	isMainScrollable: boolean;
}) => {
	const toggleAside = () => actions.shell.aside.isOpened.update(!isAsideOpened);
	const closeAside = () => actions.shell.aside.isOpened.update(false);
	const asideRef = useClickOutside(closeAside);

	const isAsideMounted = isAboveXl || isAsideOpened;

	const mainElement = mainContentStore.use();
	const reinitializeRef = useRef(() => {});
	useEffect(() => void (mainElement && reinitializeRef.current()), [mainElement]);

	return (
		<Vertical heightFull width={isAsideMounted ? 330 : 0}>
			<Transition transition="slide-left" mounted={isAsideMounted}>
				{(transitionStyles) => (
					<Vertical style={transitionStyles} ref={asideRef} padding={12}>
						<Horizontal gap={6} marginBottom={6}>
							<TableOfContentsIcon size={16} />
							<Text>Table of contents</Text>
						</Horizontal>
						<TableOfContents
							minDepthToOffset={2}
							depthOffset={20}
							size="sm"
							scrollSpyOptions={{
								selector: ".main-container h3, .main-container h4, .main-container h5, .main-container h6",
							}}
							getControlProps={({ data, active }) => ({
								onClick: () => data.getNode().scrollIntoView(),
								children: data.value,
								style: {
									overflow: "hidden",
									textOverflow: "ellipsis",
									whiteSpace: "nowrap",
									width: 230,
									backgroundColor: active ? "var(--mantine-color-primary-filled)" : undefined,
								},
							})}
							variant="light"
							reinitializeRef={reinitializeRef}
						/>
					</Vertical>
				)}
			</Transition>
			<Affix position={{ top: 70, right: isMainScrollable ? 8 : 0 }}>
				<Transition transition="slide-left" mounted={!isAsideMounted}>
					{(transitionStyles) => (
						<ActionIcon
							style={{ ...transitionStyles, borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
							onClick={toggleAside}
							variant="filled"
						>
							<TableOfContentsIcon />
						</ActionIcon>
					)}
				</Transition>
			</Affix>
		</Vertical>
	);
};
