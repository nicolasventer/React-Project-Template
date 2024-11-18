import { Text, Title } from "@mantine/core";
import { useEffect } from "react";
import { wait } from "../Common/CommonUtils";
import { tr } from "../context/GlobalState";
import { navigateToRouteFn } from "../routerInstance.gen";
import { Horizontal, Vertical } from "../utils/ComponentToolbox";

/**
 * Not found page.
 *
 * Redirects to the home page after 3 seconds.
 * @returns the not found page.
 */
export const NotFoundPage = () => {
	useEffect(() => void wait(3000).then(() => navigateToRouteFn("/")()), []);
	return (
		<>
			<Horizontal justifyContent="center" height="100%">
				<Vertical justifyContent="center">
					<Title order={1}>{tr.v["404 Not Found"]}</Title>
					<Text>{tr.v["Redirecting to the home page..."]}</Text>
				</Vertical>
			</Horizontal>
		</>
	);
};
