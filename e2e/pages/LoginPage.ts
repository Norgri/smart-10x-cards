import { type Page, type Locator, expect } from "@playwright/test";
import BasePage from "./BasePage";

export default class LoginPage extends BasePage {
  // Lokatory dla elementów strony
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly registerLink: Locator;
  readonly authPage: Locator;
  readonly appTitle: Locator;
  readonly authDescription: Locator;
  readonly authFormContainer: Locator;

  constructor(page: Page) {
    super(page);

    // Inicjalizacja lokatorów za pomocą data-testid
    this.emailInput = page.getByTestId("email-input");
    this.passwordInput = page.getByTestId("password-input");
    this.loginButton = page.getByTestId("login-button");
    this.forgotPasswordLink = page.getByTestId("forgot-password-link");
    this.registerLink = page.getByTestId("register-link");
    this.authPage = page.getByTestId("auth-page");
    this.appTitle = page.getByTestId("app-title");
    this.authDescription = page.getByTestId("auth-description");
    this.authFormContainer = page.getByTestId("auth-form-container");
  }

  async navigateToLoginPage(): Promise<void> {
    await this.navigateTo("/auth/login");
    await this.waitForLoginPageToLoad();
  }

  async waitForLoginPageToLoad(): Promise<void> {
    await this.waitForPageLoad();
    await expect(this.authPage).toBeVisible();
    await expect(this.appTitle).toBeVisible();
  }

  async fillLoginForm(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async submitLoginForm(): Promise<void> {
    await this.loginButton.click();
  }

  async login(email: string, password: string): Promise<void> {
    await this.fillLoginForm(email, password);
    await this.submitLoginForm();
  }

  async verifyErrorMessage(errorText: string): Promise<void> {
    // Weryfikacja komunikatu o błędzie (toast)
    await expect(this.page.getByText(errorText)).toBeVisible();
  }
}
