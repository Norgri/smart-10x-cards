import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EmptyState } from "@/components/EmptyState";

describe("EmptyState", () => {
  it("renders correctly with default props", () => {
    const mockOnOpenFormDialog = vi.fn();
    render(<EmptyState onOpenFormDialog={mockOnOpenFormDialog} />);

    // Sprawdzenie, czy wyświetlany jest poprawny tytuł
    expect(screen.getByText("You have no flashcards yet!")).toBeInTheDocument();

    // Sprawdzenie, czy wyświetlany jest poprawny opis
    expect(
      screen.getByText("Get started by creating your first flashcard or generate them using AI.")
    ).toBeInTheDocument();

    // Sprawdzenie, czy przyciski są poprawnie wyświetlane
    expect(screen.getByText("Add Flashcard")).toBeInTheDocument();
    expect(screen.getByText("Generate Flashcards")).toBeInTheDocument();
  });

  it("calls onOpenFormDialog when Add Flashcard button is clicked", () => {
    const mockOnOpenFormDialog = vi.fn();
    render(<EmptyState onOpenFormDialog={mockOnOpenFormDialog} />);

    // Kliknięcie w przycisk "Add Flashcard"
    fireEvent.click(screen.getByText("Add Flashcard"));

    // Sprawdzenie, czy funkcja została wywołana
    expect(mockOnOpenFormDialog).toHaveBeenCalledTimes(1);
  });

  it("redirects to generate page when Generate Flashcards button is clicked", () => {
    // Mockowanie window.location.href
    const originalLocation = window.location;
    window.location = { href: "" } as Location;

    const mockOnOpenFormDialog = vi.fn();
    render(<EmptyState onOpenFormDialog={mockOnOpenFormDialog} />);

    // Kliknięcie w przycisk "Generate Flashcards"
    fireEvent.click(screen.getByText("Generate Flashcards"));

    // Sprawdzenie, czy nastąpiło przekierowanie na odpowiednią stronę
    expect(window.location.href).toBe("/generate");

    // Przywrócenie oryginalnego window.location
    window.location = originalLocation;
  });
});
