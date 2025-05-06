import type { SupabaseClient } from "@supabase/supabase-js";
import type { GeneratedFlashcardDTO, GenerationSessionDTO } from "../../types";
import type { OpenRouterService, Message } from "./openrouter.service";

export class GenerationService {
  constructor(
    private readonly supabase: SupabaseClient,
    private readonly openRouterService: OpenRouterService
  ) {}

  private async imageToBase64(image: File): Promise<string> {
    const buffer = await image.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const mimeType = image.type;
    return `data:${mimeType};base64,${base64}`;
  }

  private buildPrompt(imageBase64: string): Message[] {
    return [
      {
        role: "system",
        content:
          "You are a helpful assistant that creates flashcards from textbook images. Each flashcard should contain an English word/phrase on the front, its Polish translation on the back, and optionally phonetic transcription. Also suggest up to 4 relevant tags for each flashcard.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Please analyze this textbook image and create flashcards from it. For each flashcard provide: front (English), back (Polish), optional phonetic transcription, and up to 4 relevant tags in Polish. Format the response as a JSON array of flashcard objects.
Sample text from image:
Lesson 6.1
Daily activities - Czynności dnia codziennego
do my homework duː maɪ ˈhəʊmwɜːk odrabiać pracę domową
get up ɡɛt ʌp wstawać

Result should be:
[{
  "front": "Daily activities",
  "back": "Czynności dnia codziennego",
  "phonetic": "",
  "tags": ["Lekcja 6.1", "Czynności dnia codziennego", "czynności", "dzień"]
},
{
  "front": "do my homework",
  "back": "odrabiać pracę domową",
  "phonetic": "duː maɪ ˈhəʊmwɜːk",
  "tags": ["Lekcja 6.1", "Czynności dnia codziennego", "szkoła", "uczenie się"]
},
{
  "front": "get up",
  "back": "wstawać",
  "phonetic": "ɡɛt ʌp",
  "tags": ["Lekcja 6.1", "Czynności dnia codziennego", "budzenie się", "wstawanie"]
}]`,
          },
          {
            type: "image_url",
            image_url: {
              url: imageBase64,
            },
          },
        ],
      },
    ];
  }

  private parseAIResponse(response: string): GeneratedFlashcardDTO[] {
    try {
      const parsedResponse = JSON.parse(response);
      if (!Array.isArray(parsedResponse)) {
        throw new Error("Response is not an array");
      }

      return parsedResponse.map((card) => ({
        front: card.front,
        back: card.back,
        phonetic: card.phonetic || null,
        tags: Array.isArray(card.tags) ? card.tags.slice(0, 4) : [],
        source: "ai" as const,
      }));
    } catch (error) {
      console.error("Error parsing AI response:", error);
      throw new Error("Failed to parse AI response");
    }
  }

  private async saveGenerationSession(userId: string, model: string, generationDuration: number): Promise<number> {
    const { data, error } = await this.supabase
      .from("generation_session")
      .insert({
        user_id: userId,
        model,
        generation_duration: generationDuration,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error saving generation session:", error);
      throw new Error("Failed to save generation session");
    }

    return data.id;
  }

  private async saveGenerationError(sessionId: number, error: Error): Promise<void> {
    const { error: dbError } = await this.supabase.from("generation_error").insert({
      session_id: sessionId,
      error_code: "GENERATION_FAILED",
      error_message: error.message,
    });

    if (dbError) {
      console.error("Error saving generation error:", dbError);
    }
  }

  async generateFlashcardsFromImage(userId: string, image: File): Promise<GenerationSessionDTO> {
    const startTime = Date.now();
    let sessionId: number | null = null;

    try {
      // Convert image to base64
      const imageBase64 = await this.imageToBase64(image);

      // Build prompt for AI
      const messages = this.buildPrompt(imageBase64);

      // Request flashcards generation from OpenRouter
      const aiResponse = await this.openRouterService.sendRequest(messages, {
        type: "json_object",
        schema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              front: { type: "string" },
              back: { type: "string" },
              phonetic: { type: "string", nullable: true },
              tags: { type: "array", items: { type: "string" }, maxItems: 4 },
            },
            required: ["front", "back"],
          },
        },
      });

      // Parse and validate AI response
      const flashcards = this.parseAIResponse(aiResponse.choices[0].message.content);

      // Save generation session
      const generationDuration = Date.now() - startTime;
      sessionId = await this.saveGenerationSession(userId, aiResponse.model, generationDuration);

      // Return session data
      return {
        id: aiResponse.id,
        flashcards,
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error generating flashcards:", error);

      // Save error if session was created
      if (sessionId && error instanceof Error) {
        await this.saveGenerationError(sessionId, error);
      }

      return {
        id: `error-${Date.now()}`,
        errors: [
          {
            id: 1,
            errorCode: "GENERATION_FAILED",
            errorMessage: error instanceof Error ? error.message : "Unknown error occurred",
          },
        ],
        createdAt: new Date().toISOString(),
      };
    }
  }
}
