import { actions } from "@/actions/actions.impl";
import { pages } from "@/components/shell/pages"; // TODO: see where pages should be placed
import type { Lang } from "@/dict";
import { useCurrentRoute, type RouterPathType } from "@/routerInstance.gen";
import type { Tr } from "@/tr/en";
import { Vertical } from "@/utils/ComponentToolbox";
import { ActionIcon, Button, Transition } from "@mantine/core";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

const navbarWidth: Record<Lang, number> = {
	en: 178,
	fr: 236,
};

export const Navbar = ({
	isAboveMd,
	isNavbarOpened,
	isSetAppEnabled,
	lang,
	tr,
}: {
	isAboveMd: boolean;
	isNavbarOpened: boolean;
	isSetAppEnabled: boolean;
	lang: Lang;
	tr: Tr;
}) => {
	const { currentRoute } = useCurrentRoute();

	const toggleNavbar = () => actions.shell.navbar.isOpened.update(!isNavbarOpened);

	const isNavbarMounted = isAboveMd || isNavbarOpened;

	const navigateFn = (path: RouterPathType) => (isSetAppEnabled ? () => actions.url.update(path) : undefined);

	return (
		<Transition
			transition={{ in: { width: navbarWidth[lang] }, out: { width: 66 }, transitionProperty: "width" }}
			mounted={isNavbarMounted}
			keepMounted
		>
			{(transitionStyles) => (
				<Vertical heightFull alignItems="flex-end" style={{ ...transitionStyles, display: "flex", padding: 12 }}>
					<Vertical gap={6} flexGrow>
						{pages.map(({ title, path, icon: Icon }) =>
							isNavbarMounted ? (
								<Button
									key={title}
									variant={path === currentRoute ? "light" : "subtle"}
									c={path === currentRoute ? undefined : "var(--mantine-color-text)"}
									size="compact-md"
									fw={400}
									justify="flex-start"
									leftSection={<Icon size={20} />}
									onClick={navigateFn(path)}
								>
									{tr[title]}
								</Button>
							) : (
								<ActionIcon key={title} variant={path === currentRoute ? "light" : "subtle"} onClick={navigateFn(path)}>
									<Icon size={20} />
								</ActionIcon>
							)
						)}
					</Vertical>
					<div>
						{!isAboveMd && (
							<ActionIcon variant="light" onClick={toggleNavbar}>
								{isNavbarOpened ? <ChevronsLeft /> : <ChevronsRight />}
							</ActionIcon>
						)}
					</div>
				</Vertical>
			)}
		</Transition>
	);
};
