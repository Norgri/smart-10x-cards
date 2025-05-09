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
          "You are a specialized AI trained to extract text from English-Polish textbook images and create high-quality flashcards. You can recognize English words/phrases, their phonetic transcriptions, and Polish translations directly from textbook pages.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze this English-Polish textbook image:
1. First, extract all visible text including English words/phrases, phonetic transcriptions, and Polish translations
2. Identify lesson numbers, sections, and any organizational structure
3. Create flashcards with:
   - front: English word/phrase
   - back: Polish translation
   - phonetic: Phonetic transcription (extract from image if available, if not try to generate english phonetic transcription)
   - tags: Up to 4 relevant tags only in Polish language based on context (lesson number, category, etc.) - Lesson 6.1 is Lekcja 6.1 in Polish

Format your response as a JSON array of flashcard objects:
[{
  "front": "English word/phrase",
  "back": "Polish translation",
  "phonetic": "Phonetic transcription if available",
  "tags": ["Tag1", "Tag2", "Tag3", "Tag4"]
}]
Return only the JSON array, nothing else.

Extract ALL vocabulary entries from the image, not just a few examples.`,
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
        type: "json_schema",
        json_schema: {
          name: "flashcard_response",
          strict: true,
          schema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                front: { type: "string" },
                back: { type: "string" },
                phonetic: { type: "string", nullable: true },
                tags: { type: "array", items: { type: "string" } },
              },
              required: ["front", "back"],
            },
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
        id: sessionId,
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
        id: sessionId,
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
