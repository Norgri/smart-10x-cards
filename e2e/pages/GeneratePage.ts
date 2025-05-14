import { type Page, type Locator, expect } from "@playwright/test";
import BasePage from "./BasePage";

export default class GeneratePage extends BasePage {
  // Lokatory dla elementów strony
  readonly generatePage: Locator;
  readonly generatePageTitle: Locator;
  readonly userInfo: Locator;
  readonly generateFlashcardsComponent: Locator;

  constructor(page: Page) {
    super(page);

    // Inicjalizacja lokatorów za pomocą data-testid
    this.generatePage = page.getByTestId("generate-page");
    this.generatePageTitle = page.getByTestId("generate-page-title");
    this.userInfo = page.getByTestId("user-info");
    this.generateFlashcardsComponent = page.getByTestId("generate-flashcards-component");
  }

  async waitForGeneratePageToLoad(): Promise<void> {
    await this.waitForPageLoad();
    await expect(this.generatePage).toBeVisible();
    await expect(this.generatePageTitle).toBeVisible();
  }

  async isLoggedIn(): Promise<boolean> {
    await this.waitForGeneratePageToLoad();
    return await this.userInfo.isVisible();
  }

  async getUserEmail(): Promise<string | null> {
    const userInfoText = await this.userInfo.textContent();
    if (!userInfoText) return null;

    // Wyciągnięcie adresu email z tekstu "Zalogowano jako: email@example.com"
    const match = userInfoText.match(/Zalogowano jako: (.+)/);
    return match ? match[1].trim() : null;
  }

  async verifySuccessfulLogin(expectedEmail: string): Promise<void> {
    await expect(this.generatePage).toBeVisible();
    const userEmail = await this.getUserEmail();
    expect(userEmail).toBe(expectedEmail);
  }
}
