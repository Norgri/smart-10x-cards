import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

/**
 * Funkcja pomocnicza do logowania w testach E2E
 */
export async function login(page: Page, email = "test@example.com", password = "password123") {
  await page.goto("/login");
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL("/dashboard");
}

/**
 * Funkcja pomocnicza do rejestracji w testach E2E
 */
export async function register(page: Page, email = `test-${Date.now()}@example.com`, password = "password123") {
  await page.goto("/register");
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.fill('input[name="confirmPassword"]', password);
  await page.click('button[type="submit"]');

  // Po rejestracji powinno nastąpić przekierowanie na dashboard
  await expect(page).toHaveURL("/dashboard");
  return { email, password };
}

/**
 * Funkcja pomocnicza do wylogowania w testach E2E
 */
export async function logout(page: Page) {
  // Zakładamy, że istnieje przycisk/link do wylogowania
  await page.getByRole("button", { name: /logout|sign out|wyloguj/i }).click();

  // Po wylogowaniu powinno nastąpić przekierowanie na stronę główną lub logowania
  await expect(page).toHaveURL(/\/(login)?$/);
}
