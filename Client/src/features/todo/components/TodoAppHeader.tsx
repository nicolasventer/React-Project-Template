import { DarkModeButton } from "@/components/_common/DarkModeButton";
import { LangButton } from "@/components/_common/LangButton";
import type { TodoTr } from "@/features/todo/dict/lang/en";
import { todoApp } from "@/features/todo/logic";
import { app } from "@/logic";
import "./TodoAppHeader.css";

export type TodoAppHeaderProps = { tr: TodoTr };

export const TodoAppHeader = ({ tr }: TodoAppHeaderProps) => {
	const sharedTr = app.tr.data.use();

	return (
		<header>
			<div className="page-header-nav">
				<button type="button" className="link" onClick={app.route.fn.navigateToRouteFn("/")}>
					{tr.todo.action.backHome}
				</button>
				<button type="button" className="link" onClick={todoApp.route.fn.todo.openLastOpenedFn(tr)}>
					{tr.todo.action.openLastOpened}
				</button>
			</div>
			<div className="page-header-actions">
				<LangButton tr={sharedTr} />
				<DarkModeButton tr={sharedTr} />
			</div>
		</header>
	);
};
