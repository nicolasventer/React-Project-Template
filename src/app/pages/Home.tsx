import { tr } from "@/app/logic/tr";
import styles from "./Home.module.css";

export const Home = () => {
	const trV = tr.use();

	return (
		<div className={styles.root}>
			<h1 className={styles.title}>{trV.home.title}</h1>
			<p className={styles.subtitle}>{trV.home.subtitle}</p>
		</div>
	);
};
