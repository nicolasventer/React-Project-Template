import { ActionIcon } from "@mantine/core";
import { FaGithub } from "react-icons/fa";

/**
 * A button component that links to the GitHub repository.
 *
 * @returns The rendered GitHub button component.
 */
export const GithubButton = () => (
	<ActionIcon component="a" href="https://github.com/nicolasventer/Preact-Project-Template" target="_blank">
		<FaGithub size={24} />
	</ActionIcon>
);
