import { ActionIcon } from "@mantine/core";
import { FaGithub } from "react-icons/fa";

export const GithubButton = () => (
	<ActionIcon component="a" href="https://github.com/nicolasventer/Preact-Project-Template" target="_blank">
		<FaGithub size={24} />
	</ActionIcon>
);
