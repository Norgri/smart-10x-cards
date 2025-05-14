import { http, HttpResponse } from "msw";

// Przykładowe dane testowe
const mockFlashcards = [
  {
    id: 1,
    userId: "user1",
    front: "Apple",
    back: "Jabłko",
    phonetic: "ˈæpl",
    tags: ["fruit", "food"],
    createdAt: "2023-05-01T12:00:00Z",
    updatedAt: "2023-05-01T12:00:00Z",
    source: "manual",
  },
  {
    id: 2,
    userId: "user1",
    front: "Car",
    back: "Samochód",
    phonetic: "kɑːr",
    tags: ["vehicle", "transport"],
    createdAt: "2023-05-02T12:00:00Z",
    updatedAt: "2023-05-02T12:00:00Z",
    source: "manual",
  },
];

export const handlers = [
  // Pobieranie fiszek
  http.get("/api/flashcards", () => {
    return HttpResponse.json({
      data: mockFlashcards,
      total: mockFlashcards.length,
    });
  }),

  // Pobieranie pojedynczej fiszki
  http.get("/api/flashcards/:id", ({ params }) => {
    const { id } = params;
    const flashcard = mockFlashcards.find((card) => card.id === Number(id));

    if (!flashcard) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(flashcard);
  }),

  // Tworzenie nowej fiszki
  http.post("/api/flashcards", async ({ request }) => {
    const newFlashcard = await request.json();
    const createdFlashcard = {
      id: mockFlashcards.length + 1,
      userId: "user1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      source: "manual",
      ...newFlashcard,
    };

    return HttpResponse.json(createdFlashcard, { status: 201 });
  }),

  // Aktualizacja fiszki
  http.put("/api/flashcards/:id", async ({ params, request }) => {
    const { id } = params;
    const updatedData = await request.json();
    const existingFlashcard = mockFlashcards.find((card) => card.id === Number(id));

    if (!existingFlashcard) {
      return new HttpResponse(null, { status: 404 });
    }

    const updatedFlashcard = {
      ...existingFlashcard,
      ...updatedData,
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json(updatedFlashcard);
  }),

  // Usuwanie fiszki
  http.delete("/api/flashcards/:id", ({ params }) => {
    const { id } = params;
    const flashcardExists = mockFlashcards.some((card) => card.id === Number(id));

    if (!flashcardExists) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json({ message: "Flashcard deleted successfully" });
  }),
];
