import { AppLifeCycle } from "@/app/components/AppLifeCycle";
import { DarkModeButton } from "@/app/components/DarkModeButton";
import { LangButton } from "@/app/components/LangButton";
import { enabledFeatures } from "@/app/featureRegister";
import { route } from "@/app/logic/route";
import { tr } from "@/app/logic/tr";
import { Home } from "@/app/pages/Home";
import { NotFound } from "@/app/pages/NotFound";
import { SwitchV } from "@/shared/utils/MultiIf";
import type { ReactNode } from "react";
import styles from "./App.module.css";

export const App = () => {
	const r = route.router.use();
	const trV = tr.use();

	return (
		<div className={styles.app}>
			<AppLifeCycle />
			<header className={styles.header}>
				<nav className={styles.nav} aria-label="Main">
					<span className={styles.brand} onClick={route.fn.navigateToRouteFn("/")}>
						{trV.home.title}
					</span>
					{enabledFeatures.map((feature) => (
						<a
							key={feature.link}
							href={feature.link}
							className={styles.navLink}
							onClick={route.fn.navigateToCustomRouteFn(feature.link)}
						>
							{feature.link}
						</a>
					))}
				</nav>
				<div className={styles.headerActions}>
					<LangButton tr={trV} />
					<DarkModeButton tr={trV} />
				</div>
			</header>
			<main className={styles.main}>
				<SwitchV
					value={r}
					transform={(r) => r.path}
					cases={[
						["/", Home],
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						["/404", () => <NotFound {...(r.params as any)} />],
						...enabledFeatures.map(
							(feature) =>
								[
									feature.route.path,
									// eslint-disable-next-line @typescript-eslint/no-explicit-any
									() => <feature.route.Render {...(r.params as any)} />,
								] satisfies [typeof feature.route.path, () => ReactNode],
						),
					]}
				/>
			</main>
		</div>
	);
};
