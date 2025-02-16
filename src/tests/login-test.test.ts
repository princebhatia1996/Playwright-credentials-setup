import { test, expect } from "@playwright/test";
import { login } from "../util/login";

test.describe("Sauce Labs Login Tests", () => {
  test("login to sauce labs with valid credentials", async ({ page }) => {
    await login(page, "standard_user");
    await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
  });

  test("login to sauce labs with invalid credentials", async ({ page }) => {
    await login(page, "invalid_user");
    await expect(page).toHaveURL("https://www.saucedemo.com/");
  });
});
