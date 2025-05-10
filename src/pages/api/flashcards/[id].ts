import type { APIRoute } from "astro";
import { z } from "zod";
import type { UpdateFlashcardCommand } from "../../../types";
import { FlashcardService } from "../../../lib/services/flashcard.service";

/**
 * @api {get} /api/flashcards/:id Get Flashcard
 * @apiName GetFlashcard
 * @apiGroup Flashcards
 * @apiDescription Retrieves a single flashcard by ID
 *
 * @apiParam {Number} id Flashcard ID
 *
 * @apiSuccess {Object} data Flashcard details
 *
 * @apiError (400) {Object} error Invalid flashcard ID
 * @apiError (404) {Object} error Flashcard not found
 * @apiError (500) {Object} error Internal server error
 */

// Schema for validating flashcard ID from URL params
const flashcardIdSchema = z.coerce.number().int().positive();

/**
 * @api {put} /api/flashcards/:id Update Flashcard
 * @apiName UpdateFlashcard
 * @apiGroup Flashcards
 * @apiDescription Updates an existing flashcard
 *
 * @apiParam {Number} id Flashcard ID
 * @apiBody {String} front Front side text
 * @apiBody {String} back Back side text
 * @apiBody {String} [phonetic] Optional phonetic transcription
 * @apiBody {String[]} tags Array of tags (max 4)
 *
 * @apiSuccess {Object} data Updated flashcard
 *
 * @apiError (400) {Object} error Invalid request body or ID
 * @apiError (404) {Object} error Flashcard not found
 * @apiError (500) {Object} error Internal server error
 */

// Schema for updating a flashcard
const updateFlashcardSchema = z.object({
  front: z.string().min(1),
  back: z.string().min(1),
  phonetic: z.string().nullable().optional(),
  tags: z.array(z.string()).max(4),
  id: z.number().int().positive(),
}) satisfies z.ZodType<UpdateFlashcardCommand>;

/**
 * @api {delete} /api/flashcards/:id Delete Flashcard
 * @apiName DeleteFlashcard
 * @apiGroup Flashcards
 * @apiDescription Deletes a flashcard
 *
 * @apiParam {Number} id Flashcard ID
 *
 * @apiSuccess {Object} message Success message
 *
 * @apiError (400) {Object} error Invalid flashcard ID
 * @apiError (404) {Object} error Flashcard not found
 * @apiError (500) {Object} error Internal server error
 */

export const prerender = false;

// GET /api/flashcards/[id] - Get a single flashcard by ID
export const GET: APIRoute = async ({ params, locals }) => {
  try {
    const idValidation = flashcardIdSchema.safeParse(params.id);

    if (!idValidation.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid flashcard ID",
          details: idValidation.error.issues,
        }),
        { status: 400 }
      );
    }

    const flashcardService = new FlashcardService(locals.supabase);
    const result = await flashcardService.getFlashcard(locals.user.id, idValidation.data);

    if (!result) {
      return new Response(JSON.stringify({ error: "Flashcard not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/flashcards/[id]:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
};

// PUT /api/flashcards/[id] - Update a flashcard
export const PUT: APIRoute = async ({ request, params, locals }) => {
  try {
    const idValidation = flashcardIdSchema.safeParse(params.id);

    if (!idValidation.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid flashcard ID",
          details: idValidation.error.issues,
        }),
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate request body
    const validationResult = updateFlashcardSchema.safeParse({
      ...body,
      id: idValidation.data,
    });

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

    try {
      const result = await flashcardService.updateFlashcard(locals.user.id, validationResult.data);
      return new Response(JSON.stringify(result), { status: 200 });
    } catch (error) {
      if (error instanceof Error && error.message.includes("not found")) {
        return new Response(JSON.stringify({ error: "Flashcard not found" }), { status: 404 });
      }
      throw error;
    }
  } catch (error) {
    console.error("Error in PUT /api/flashcards/[id]:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
};

// DELETE /api/flashcards/[id] - Delete a flashcard
export const DELETE: APIRoute = async ({ params, locals }) => {
  try {
    const idValidation = flashcardIdSchema.safeParse(params.id);

    if (!idValidation.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid flashcard ID",
          details: idValidation.error.issues,
        }),
        { status: 400 }
      );
    }

    const flashcardService = new FlashcardService(locals.supabase);

    try {
      await flashcardService.deleteFlashcard(locals.user.id, idValidation.data);
      return new Response(JSON.stringify({ message: "Flashcard deleted successfully" }), { status: 200 });
    } catch (error) {
      if (error instanceof Error && error.message.includes("not found")) {
        return new Response(JSON.stringify({ error: "Flashcard not found" }), { status: 404 });
      }
      throw error;
    }
  } catch (error) {
    console.error("Error in DELETE /api/flashcards/[id]:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
};
