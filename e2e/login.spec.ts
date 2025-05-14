import { test, expect } from "@playwright/test";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import { credentials } from "playwright.config";

test.describe("User login scenario", () => {
  /**
   * Test weryfikujący scenariusz:
   * 2. Logowanie użytkownika
   *   - Warunki wstępne: Użytkownik posiada konto
   *   - Kroki:
   *     1. Otwarcie strony logowania
   *     2. Wprowadzenie poprawnych danych (email, hasło)
   *     3. Kliknięcie przycisku "Zaloguj"
   *   - Oczekiwany wynik: Użytkownik zostaje zalogowany i przekierowany na dashboard
   *   - Kryteria akceptacji: Użytkownik otrzymuje token uwierzytelniający, sesja jest aktywna
   */
  test("User can successfully login with valid credentials", async ({ page, context }) => {
    // Arrange - przygotowanie testowych danych
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const testEmail = credentials.user;
    const testPassword = credentials.password;

    // Act - wykonanie kroków scenariusza
    await loginPage.navigateToLoginPage();
    await loginPage.login(testEmail, testPassword);

    // Assert - weryfikacja oczekiwanych rezultatów
    // 1. Sprawdzenie przekierowania na dashboard
    await dashboardPage.waitForDashboardPageToLoad();
    await dashboardPage.verifySuccessfulLogin();

    // 2. Weryfikacja czy sesja jest aktywna (token uwierzytelniający)
    const cookies = await context.cookies();
    const authCookie = cookies.find((cookie) => cookie.name.includes("auth"));
    expect(authCookie).toBeDefined();
  });

  test("User cannot login with invalid credentials", async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);

    const invalidEmail = "invalid@example.com";
    const invalidPassword = "wrongpassword";

    // Act
    await loginPage.navigateToLoginPage();
    await loginPage.login(invalidEmail, invalidPassword);

    // Assert
    await loginPage.verifyErrorMessage("Nieprawidłowy email lub hasło");
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
