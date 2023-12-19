import test, { Page } from "@playwright/test";
import MCR from "monocart-coverage-reports";
import { env } from "process";

const mcr = MCR({
	reports: ["v8"],
	cleanCache: true,
	entryFilter(entryPath) {
		return (
			!entryPath.url.includes("node_modules") &&
			!entryPath.url.includes("@vite/client") &&
			!entryPath.url.includes("playwright.dev")
		);
	},
});

type BrowserName = "chromium" | "firefox" | "webkit";

const bUseCoverage = env.USE_COVERAGE === "true";

const startCoverage = async ({ browserName, page }: { browserName: BrowserName; page: Page }) => {
	if (bUseCoverage && browserName === "chromium")
		await Promise.all([
			page.coverage.startJSCoverage({ resetOnNavigation: false }),
			page.coverage.startCSSCoverage({ resetOnNavigation: false }),
		]);
};

const stopCoverage = async ({ browserName, page }: { browserName: BrowserName; page: Page }) => {
	if (bUseCoverage && browserName === "chromium") {
		const [jsCoverage, cssCoverage] = await Promise.all([page.coverage.stopJSCoverage(), page.coverage.stopCSSCoverage()]);
		const coverageData = [...jsCoverage, ...cssCoverage];
		await mcr.add(coverageData);
	}
};

const generateCoverage = async ({ browserName }: { browserName: BrowserName }) => {
	if (bUseCoverage && browserName === "chromium") await mcr.generate();
};

/**
 * Activate coverage for the test
 * @param t Test object
 * @example
 * import { test } from "@playwright/test";
 * import { activateCoverage } from "./testUtils";
 *
 * activateCoverage(test);
 */
export const activateCoverage = (t: typeof test) => {
	t.beforeEach(startCoverage);
	t.afterEach(stopCoverage);
	t.afterAll(generateCoverage);
};
