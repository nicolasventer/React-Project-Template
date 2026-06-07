import { route } from "@/app/logic/route";
import { tr } from "@/app/logic/tr";
import styles from "./NotFound.module.css";

export const NotFound = ({ path }: { path: string }) => {
	const trV = tr.use();

	return (
		<div className={styles.root}>
			<h1 className={styles.title}>{trV.notFound.title}</h1>
			<p className={styles.text}>{trV.notFound.notFoundPath(path)}</p>
			<button type="button" className={styles.btn} onClick={route.fn.navigateToRouteFn("/")}>
				{trV.notFound.goToHomePage}
			</button>
		</div>
	);
};
