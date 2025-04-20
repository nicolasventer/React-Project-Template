import { wait } from "@/Shared/SharedUtils";
import { useTr } from "@/globalState";
import { navigateToRouteFn } from "@/routerInstance.gen";
import { Horizontal, Vertical } from "@/utils/ComponentToolbox";
import { useMount } from "@/utils/useMount";
import { Button, Text, Title } from "@mantine/core";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

/**
 * Not found page.
 *
 * Redirects to the home page after 3 seconds. The redirection can be cancelled.
 * @returns the not found page.
 */
export const NotFoundPage = () => {
	const tr = useTr();

	const [cancelled, setCancelled] = useState(false);
	const cancel = () => {
		setCancelled(true);
		toast(tr["Redirect cancelled."], { duration: 3000 });
	};

	// cancelled ref needed since closure is by value
	const cancelledRef = useRef(false);
	cancelledRef.current = cancelled;
	useMount(() => void wait(3000).then(() => !cancelledRef.current && navigateToRouteFn("/")()));

	return (
		<Horizontal justifyContent="center" height="100%">
			<Vertical justifyContent="center">
				<Title order={1}>{tr["404 Not Found"]}</Title>
				{!cancelled && <Text>{tr["Redirecting to the home page..."]}</Text>}
				<Vertical marginTop={20} alignItems="center">
					<div>
						{cancelled ? (
							<Button onClick={navigateToRouteFn("/")}>{tr["Go to Home page"]}</Button>
						) : (
							<Button onClick={cancel}>{tr["Cancel"]}</Button>
						)}
					</div>
				</Vertical>
			</Vertical>
		</Horizontal>
	);
};
