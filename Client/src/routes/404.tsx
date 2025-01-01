import { wait } from "@/Shared/SharedUtils";
import { tr } from "@/gs";
import { useMount } from "@/hooks/useMount";
import { Horizontal, Vertical } from "@/libs/StrongBox/ComponentToolbox";
import { navigateToRouteFn } from "@/routerInstance.gen";
import { Button, Text, Title } from "@mantine/core";
import { useSignal } from "@preact/signals";
import toast from "react-hot-toast";

/**
 * Not found page.
 *
 * Redirects to the home page after 3 seconds.
 * @returns the not found page.
 */
export const NotFoundPage = () => {
	const cancelled = useSignal(false);
	useMount(() => void wait(3000).then(() => !cancelled.value && navigateToRouteFn("/")()));

	const cancel = () => {
		cancelled.value = true;
		toast(tr.v["Redirect cancelled."], { duration: 3000 });
	};

	return (
		<>
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
		</>
	);
};
