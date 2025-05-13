import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("should show login form", async ({ page }) => {
    // Przejście do strony logowania
    await page.goto("/login");

    // Sprawdzenie, czy formularz logowania jest wyświetlany
    await expect(page).toHaveTitle(/Login/);
    await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("should show validation errors for empty form submission", async ({ page }) => {
    // Przejście do strony logowania
    await page.goto("/login");

    // Próba zalogowania się bez wprowadzania danych
    await page.getByRole("button", { name: /sign in/i }).click();

    // Sprawdzenie, czy wyświetlane są komunikaty o błędach
    await expect(page.getByText(/email is required/i)).toBeVisible();
    await expect(page.getByText(/password is required/i)).toBeVisible();
  });

  test("should navigate to registration page", async ({ page }) => {
    // Przejście do strony logowania
    await page.goto("/login");

    // Kliknięcie w link do rejestracji
    await page.getByRole("link", { name: /create an account/i }).click();

    // Sprawdzenie, czy nastąpiło przekierowanie na stronę rejestracji
    await expect(page).toHaveURL(/register/);
    await expect(page.getByRole("heading", { name: /create an account/i })).toBeVisible();
  });
});
