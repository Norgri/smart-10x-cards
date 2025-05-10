import type { APIRoute } from "astro";
import { z } from "zod";
import type { CreateFlashcardCommand, FlashcardDTO } from "../../../types";
import { FlashcardService } from "../../../lib/services/flashcard.service";

/**
 * @api {get} /api/flashcards Get Flashcards
 * @apiName GetFlashcards
 * @apiGroup Flashcards
 * @apiDescription Retrieves a paginated list of flashcards with optional tag filtering
 *
 * @apiQuery {Number} [page=1] Page number (starting from 1)
 * @apiQuery {Number} [limit=20] Items per page (max 100)
 * @apiQuery {String[]} [tags] Optional array of tags to filter by
 *
 * @apiSuccess {Object[]} data Array of flashcards
 * @apiSuccess {Number} total Total number of flashcards matching the criteria
 *
 * @apiError (400) {Object} error Invalid query parameters
 * @apiError (500) {Object} error Internal server error
 */

// Schema for query parameters
const listFlashcardsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  tags: z.array(z.string()).optional(),
});

/**
 * @api {post} /api/flashcards Create Flashcard
 * @apiName CreateFlashcard
 * @apiGroup Flashcards
 * @apiDescription Creates a new flashcard
 *
 * @apiBody {String} front Front side text
 * @apiBody {String} back Back side text
 * @apiBody {String} [phonetic] Optional phonetic transcription
 * @apiBody {String[]} tags Array of tags (max 4)
 *
 * @apiSuccess {Object} data Created flashcard
 *
 * @apiError (400) {Object} error Invalid request body
 * @apiError (500) {Object} error Internal server error
 */

// Schema for creating a flashcard
const createFlashcardSchema = z.object({
  front: z.string().min(1),
  back: z.string().min(1),
  phonetic: z.string().nullable().optional(),
  tags: z.array(z.string()).max(4),
}) satisfies z.ZodType<CreateFlashcardCommand>;

export const prerender = false;

// GET /api/flashcards - List flashcards with pagination and optional tag filtering
export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams);

    // Parse and validate query parameters with defaults
    const queryResult = listFlashcardsQuerySchema.safeParse({
      page: params.page,
      limit: params.limit,
      tags: params.tags ? params.tags.split(",") : undefined,
    });

    if (!queryResult.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid query parameters",
          details: queryResult.error.issues,
        }),
        { status: 400 }
      );
    }

    const { page, limit, tags } = queryResult.data;
    const flashcardService = new FlashcardService(locals.supabase);

    const result = await flashcardService.listFlashcards(locals.user.id, page, limit, tags);

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/flashcards:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
};

// POST /api/flashcards - Create a new flashcard
export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = createFlashcardSchema.safeParse(body);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid request body",
          details: validationResult.error.issues,
        }),
        { status: 400 }
      );
    }

    const flashcardService = new FlashcardService(locals.supabase);
    const result = await flashcardService.createFlashcard(locals.user.id, validationResult.data);

    return new Response(JSON.stringify(result), { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/flashcards:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
};
