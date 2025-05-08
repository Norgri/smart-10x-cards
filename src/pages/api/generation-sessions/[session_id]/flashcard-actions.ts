import type { APIRoute } from "astro";
import { z } from "zod";
import type { LogFlashcardActionCommand } from "../../../../types";
import { FlashcardActionService } from "../../../../lib/services/flashcard-action.service";

// Disable prerendering for this endpoint as it handles dynamic data
export const prerender = false;

// Schema for validating generated flashcard data
const GeneratedFlashcardSchema = z.object({
  front: z.string().min(1, "Front text is required"),
  back: z.string().min(1, "Back text is required"),
  phonetic: z.string().nullable().optional(),
  tags: z.array(z.string()).max(4, "Maximum 4 tags are allowed"),
  source: z.literal("ai"),
});

// Schema for validating flashcard action command
const LogFlashcardActionSchema = z
  .object({
    actionType: z.enum(["accepted", "edited", "rejected"]),
    generatedFlashcard: z.union([GeneratedFlashcardSchema, z.undefined()]),
  })
  .refine((data) => data.actionType === "rejected" || data.generatedFlashcard !== undefined, {
    message: "Flashcard data is required for 'accepted' or 'edited' actions",
    path: ["generatedFlashcard"],
  }) satisfies z.ZodType<LogFlashcardActionCommand>;

export const POST: APIRoute = async ({ request, params, locals }): Promise<Response> => {
  try {
    // Extract session ID from URL params
    const { session_id: sessionId } = params;
    if (!sessionId) {
      return new Response(JSON.stringify({ error: "Session ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = LogFlashcardActionSchema.safeParse(body);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: "Validation failed",
          details: validationResult.error.errors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Initialize service and process the action using user ID from locals
    const flashcardActionService = new FlashcardActionService(locals.supabase);
    const result = await flashcardActionService.logFlashcardAction(sessionId, locals.user.id, validationResult.data);

    // Return successful response
    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing flashcard action:", error);

    // Handle known error types
    if (error instanceof Error && error.message.includes("not found")) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Handle unexpected errors
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
