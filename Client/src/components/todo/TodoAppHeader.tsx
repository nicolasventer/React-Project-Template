import { DarkModeButton } from "@/components/_common/DarkModeButton";
import { LangButton } from "@/components/_common/LangButton";
import type { Tr } from "@/dict/lang/en";
import { app } from "@/logic";
import "./TodoAppHeader.css";

export type TodoAppHeaderProps = { tr: Tr };

export const TodoAppHeader = ({ tr }: TodoAppHeaderProps) => (
	<header>
		<button type="button" className="link" onClick={app.route.navigateToRouteFn({ url: "/" })}>
			{tr.TodoBackHome}
		</button>
		<div className="pageHeader-actions">
			<LangButton tr={tr} />
			<DarkModeButton tr={tr} />
		</div>
	</header>
);
