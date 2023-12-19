import { expect, test } from "@playwright/test";
import { activateCoverage } from "./testUtils";

activateCoverage(test);

test.beforeEach(({ context }) => context.storageState({}));

test("has title", async ({ page }) => {
	await page.goto("https://playwright.dev/");

	// Expect a title "to contain" a substring.
	await expect(page).toHaveTitle(/Playwright/);
});

test("get started link", async ({ page }) => {
	await page.goto("https://playwright.dev/");

	// Click the get started link.
	await page.getByRole("link", { name: "Get started" }).click();

	// Expects page to have a heading with the name of Installation.
	await expect(page.getByRole("heading", { name: "Installation" })).toBeVisible();
});

test("valid dark mode button toggle", async ({ page }) => {
	await page.goto("/");
	await expect(page.locator("#light-mode-button")).toBeVisible();
	await page.locator("#light-mode-button").click();
	await expect(page.locator("#dark-mode-button")).toBeVisible();
	await page.locator("#dark-mode-button").click();
	await expect(page.locator("#light-mode-button")).toBeVisible();
});
