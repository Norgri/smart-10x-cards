import { test, expect } from "@playwright/test";
import { login } from "./utils/auth-helpers";

test.describe("Flashcards management", () => {
  // Hook wykonywany przed każdym testem - logowanie użytkownika
  test.beforeEach(async ({ page }) => {
    // Używamy funkcji pomocniczej do logowania
    await login(page);
  });

  test("should display empty state when no flashcards", async ({ page }) => {
    // Zakładamy, że użytkownik nie ma jeszcze żadnych fiszek
    // Sprawdzenie, czy wyświetlany jest komunikat o braku fiszek
    await expect(page.getByText("You have no flashcards yet!")).toBeVisible();
    await expect(page.getByRole("button", { name: "Add Flashcard" })).toBeVisible();
  });

  test("should be able to add a new flashcard manually", async ({ page }) => {
    // Kliknięcie przycisku "Add Flashcard"
    await page.getByRole("button", { name: "Add Flashcard" }).click();

    // Wypełnienie formularza
    await page.fill('input[name="front"]', "Test Front");
    await page.fill('input[name="back"]', "Test Back");
    await page.fill('input[name="tags"]', "test, example");

    // Zapisanie fiszki
    await page.getByRole("button", { name: /save/i }).click();

    // Sprawdzenie, czy fiszka została dodana
    await expect(page.getByText("Test Front")).toBeVisible();
    await expect(page.getByText("Test Back")).toBeVisible();
  });

  test("should be able to edit an existing flashcard", async ({ page }) => {
    // Zakładamy, że użytkownik ma już przynajmniej jedną fiszkę
    // Kliknięcie w przycisk edycji
    await page.getByRole("button", { name: /edit/i }).first().click();

    // Zmiana treści fiszki
    await page.fill('input[name="front"]', "Updated Front");
    await page.fill('input[name="back"]', "Updated Back");

    // Zapisanie zmian
    await page.getByRole("button", { name: /save/i }).click();

    // Sprawdzenie, czy zmiany zostały zapisane
    await expect(page.getByText("Updated Front")).toBeVisible();
    await expect(page.getByText("Updated Back")).toBeVisible();
  });

  test("should be able to delete a flashcard", async ({ page }) => {
    // Zakładamy, że użytkownik ma już przynajmniej jedną fiszkę
    // Kliknięcie w przycisk usuwania
    await page
      .getByRole("button", { name: /delete/i })
      .first()
      .click();

    // Potwierdzenie usunięcia
    await page.getByRole("button", { name: /confirm/i }).click();

    // Sprawdzenie, czy fiszka została usunięta
    // Jeśli to była ostatnia fiszka, powinien pojawić się komunikat o braku fiszek
    await expect(page.getByText("You have no flashcards yet!")).toBeVisible();
  });
});
