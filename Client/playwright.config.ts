import { defineConfig, devices } from "@playwright/test";
import { env } from "process";

const bUseHtml = env.USE_HTML === "true";
const bUseCsr = env.USE_CSR === "true";

const baseURL = bUseCsr ? "http://localhost:3000" : "http://localhost:5173";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: "./tests",
	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Retry */
	retries: 1,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: [["list"], ...(bUseHtml ? ([["html", { open: "always" }]] as const) : [])],
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		/* Base URL to use in actions like `await page.goto('/')`. */
		baseURL,
		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: bUseHtml ? "on" : "off",
		video: bUseHtml ? "on" : "off",
	},

	/* Configure projects for major browsers */
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},

		{
			name: "firefox",
			use: { ...devices["Desktop Firefox"] },
		},

		{
			name: "webkit",
			use: { ...devices["Desktop Safari"] },
		},

		/* Test against mobile viewports. */
		{
			name: "Mobile Chrome",
			use: { ...devices["Pixel 5"] },
		},
		{
			name: "Mobile Safari",
			use: { ...devices["iPhone 12"] },
		},
	],

	/* Run your local dev server before starting the tests */
	webServer: {
		command: bUseCsr ? "bun run --cwd=../Server starttest" : "bun run dev",
		url: baseURL,
		reuseExistingServer: true,
	},
});
