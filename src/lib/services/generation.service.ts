import type { SupabaseClient } from "@supabase/supabase-js";
import type { GeneratedFlashcardDTO, GenerationSessionDTO } from "../../types";

export class GenerationService {
  constructor(private readonly supabase: SupabaseClient) {}

  /**
   * Processes an image and generates flashcards using AI.
   * For now, this is a mock implementation that will be replaced with actual AI integration.
   */
  async generateFlashcardsFromImage(userId: string, image: File): Promise<GenerationSessionDTO> {
    // Mock generated flashcards (will be replaced with actual AI processing)

    console.log("Generating flashcards from image for user:", userId);
    console.log("Image:", image);

    const mockFlashcards: GeneratedFlashcardDTO[] = [
      {
        front: "What is TypeScript?",
        back: "TypeScript is a strongly typed programming language that builds on JavaScript",
        phonetic: null,
        tags: ["programming", "typescript"],
        source: "ai",
      },
      {
        front: "こんにちは",
        back: "Hello (formal greeting in Japanese)",
        phonetic: "konnichiwa",
        tags: ["japanese", "greeting"],
        source: "ai",
      },
      {
        front: "What is React?",
        back: "React is a JavaScript library for building user interfaces",
        phonetic: null,
        tags: ["programming", "react", "frontend"],
        source: "ai",
      },
    ];

    // Return mock session data
    return {
      id: "mock-session-1",
      flashcards: mockFlashcards,
      createdAt: new Date().toISOString(),
    };
  }
}
