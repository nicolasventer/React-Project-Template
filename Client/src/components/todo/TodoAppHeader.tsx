import { DarkModeButton } from "@/components/_common/DarkModeButton";
import { LangButton } from "@/components/_common/LangButton";
import type { Tr } from "@/dict/lang/en";
import { app } from "@/logic";
import { navigateToRouteFn } from "@/routerInstance.gen";
import "./TodoAppHeader.css";

export type TodoAppHeaderProps = { tr: Tr };

export const TodoAppHeader = ({ tr }: TodoAppHeaderProps) => (
	<header>
		<div className="page-header-nav">
			<button type="button" className="link" onClick={navigateToRouteFn("/")}>
				{tr.TodoBackHome}
			</button>
			<button type="button" className="link" onClick={app.route.todo.openLastOpenedFn(tr)}>
				{tr.TodoOpenLastOpened}
			</button>
		</div>
		<div className="page-header-actions">
			<LangButton tr={tr} />
			<DarkModeButton tr={tr} />
		</div>
	</header>
);
