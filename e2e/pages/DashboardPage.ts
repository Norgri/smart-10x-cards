import { type Page, type Locator, expect } from "@playwright/test";
import BasePage from "./BasePage";

export default class DashboardPage extends BasePage {
  // Lokatory dla elementów strony
  readonly dashboardContainer: Locator;
  readonly dashboardContent: Locator;
  readonly dashboardTitle: Locator;

  constructor(page: Page) {
    super(page);

    // Inicjalizacja lokatorów za pomocą data-testid
    this.dashboardContainer = page.getByTestId("dashboard-page-container");
    this.dashboardContent = page.getByTestId("dashboard-content");
    this.dashboardTitle = page.getByTestId("dashboard-title");
  }

  async waitForDashboardPageToLoad(): Promise<void> {
    await this.waitForPageLoad();
    await expect(this.dashboardContainer).toBeVisible();
    await expect(this.dashboardContent).toBeVisible();
  }

  async isDashboardLoaded(): Promise<boolean> {
    await this.waitForDashboardPageToLoad();
    return await this.dashboardTitle.isVisible();
  }

  async getDashboardTitle(): Promise<string | null> {
    return await this.dashboardTitle.textContent();
  }

  async verifySuccessfulLogin(): Promise<void> {
    await expect(this.dashboardContainer).toBeVisible();
    await expect(this.dashboardTitle).toBeVisible();
    const title = await this.getDashboardTitle();
    expect(title).toBe("Your Flashcards");
  }
}
