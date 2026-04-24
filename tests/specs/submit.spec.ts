import { test, expect } from "@playwright/test";
import { SubmitPage } from "../pages/SubmitPage";

test.describe("Submit Event Page", () => {
  test("page container and form are visible", async ({ page }) => {
    const submitPage = new SubmitPage(page);
    await submitPage.goto();
    await expect(submitPage.container).toBeVisible();
    await expect(submitPage.form).toBeVisible();
  });

  test("all required form fields are present", async ({ page }) => {
    const submitPage = new SubmitPage(page);
    await submitPage.goto();
    await expect(submitPage.titleInput).toBeVisible();
    await expect(submitPage.dateInput).toBeVisible();
    await expect(submitPage.cityInput).toBeVisible();
    await expect(submitPage.categoryInput).toBeVisible();
    await expect(submitPage.emailInput).toBeVisible();
    await expect(submitPage.submitButton).toBeVisible();
  });

  test("title input accepts text", async ({ page }) => {
    const submitPage = new SubmitPage(page);
    await submitPage.goto();
    await submitPage.titleInput.fill("Summer Jazz Night");
    await expect(submitPage.titleInput).toHaveValue("Summer Jazz Night");
  });

  test("city input accepts text", async ({ page }) => {
    const submitPage = new SubmitPage(page);
    await submitPage.goto();
    await submitPage.cityInput.fill("Plovdiv");
    await expect(submitPage.cityInput).toHaveValue("Plovdiv");
  });

  test("email input accepts email address", async ({ page }) => {
    const submitPage = new SubmitPage(page);
    await submitPage.goto();
    await submitPage.emailInput.fill("user@example.com");
    await expect(submitPage.emailInput).toHaveValue("user@example.com");
  });

  test("category select has multiple options", async ({ page }) => {
    const submitPage = new SubmitPage(page);
    await submitPage.goto();
    const count = await submitPage.categoryInput.locator("option").count();
    expect(count).toBeGreaterThan(1);
  });

  test("valid submission shows success message", async ({ page }) => {
    const submitPage = new SubmitPage(page);
    await submitPage.goto();
    await submitPage.fillAndSubmit({
      title: "Playwright Test Event",
      date: "2026-05-25T19:30",
      city: "Sofia",
      category: "music",
      email: "test@example.com",
    });
    await expect(submitPage.successMessage).toBeVisible();
  });

  test("submitting empty form is blocked by client validation", async ({ page }) => {
    const submitPage = new SubmitPage(page);
    await submitPage.goto();
    await submitPage.submitButton.click();
    // react-hook-form validation prevents submission — success must not appear
    await expect(submitPage.successMessage).not.toBeVisible();
    await expect(page).toHaveURL("/submit");
  });

  test("submitting with only email is blocked by client validation", async ({ page }) => {
    const submitPage = new SubmitPage(page);
    await submitPage.goto();
    await submitPage.emailInput.fill("only-email@example.com");
    await submitPage.submitButton.click();
    await expect(submitPage.successMessage).not.toBeVisible();
    await expect(page).toHaveURL("/submit");
  });
});
