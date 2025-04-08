import { wait } from "@/Shared/SharedUtils";
import { tr } from "@/gs";
import { navigateToRouteFn } from "@/routerInstance.gen";
import { Horizontal, Vertical } from "@/utils/ComponentToolbox";
import { useMount } from "@/utils/useMount";
import { Button, Text, Title } from "@mantine/core";
import { useSignal } from "@preact/signals";
import toast from "react-hot-toast";

/**
 * Not found page.
 *
 * Redirects to the home page after 3 seconds. The redirection can be cancelled.
 * @returns the not found page.
 */
export const NotFoundPage = () => {
	const cancelled = useSignal(false);
	const cancel = () => {
		cancelled.value = true;
		toast(tr.v["Redirect cancelled."], { duration: 3000 });
	};

	useMount(() => void wait(3000).then(() => !cancelled.value && navigateToRouteFn("/")()));

	return (
		<Horizontal justifyContent="center" height="100%">
			<Vertical justifyContent="center">
				<Title order={1}>{tr.v["404 Not Found"]}</Title>
				{!cancelled.value && <Text>{tr.v["Redirecting to the home page..."]}</Text>}
				<Vertical marginTop={20} alignItems="center">
					<div>
						{cancelled.value ? (
							<Button onClick={navigateToRouteFn("/")}>{tr.v["Go to Home page"]}</Button>
						) : (
							<Button onClick={cancel}>{tr.v.Cancel}</Button>
						)}
					</div>
				</Vertical>
			</Vertical>
		</Horizontal>
	);
};
