import { expect, test } from "@playwright/test";
import { activateCoverage } from "./testUtils";

activateCoverage(test);

test.beforeEach(({ context }) => context.storageState({}));

test("valid dark mode button toggle", async ({ page }) => {
	await page.goto("/");
	await expect(page.locator("#light-mode-button")).toBeVisible();
	await page.locator("#light-mode-button").click();
	await expect(page.locator("#dark-mode-button")).toBeVisible();
	await page.locator("#dark-mode-button").click();
	await expect(page.locator("#light-mode-button")).toBeVisible();
});
