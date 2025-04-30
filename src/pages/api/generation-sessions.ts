import type { APIRoute } from "astro";
import { z } from "zod";
import type { GenerateFlashcardsFromImageCommand, GenerationSessionDTO } from "../../types";
import { GenerationService } from "../../lib/services/generation.service";
import { DEFAULT_USER_ID } from "../../db/supabase.client";

// Disable prerendering for this endpoint as it handles dynamic data
export const prerender = false;

// Input validation schema that matches GenerateFlashcardsFromImageCommand
const GenerateFlashcardsSchema = z.object({
  image: z
    .instanceof(File)
    .refine((file) => ["image/jpeg", "image/png"].includes(file.type), {
      message: "Only JPEG and PNG images are supported",
    })
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: "Image size must be less than 10MB",
    }),
}) satisfies z.ZodType<GenerateFlashcardsFromImageCommand>;

export const POST: APIRoute = async ({ request, locals }): Promise<Response> => {
  try {
    // Parse and validate multipart form data
    const formData = await request.formData();
    const imageFile = formData.get("image") as File | null;

    if (!imageFile) {
      return new Response(JSON.stringify({ error: "Image file is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Validate input using Zod schema and cast to command type
    const validationResult = GenerateFlashcardsSchema.safeParse({ image: imageFile });

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

    const command: GenerateFlashcardsFromImageCommand = validationResult.data;

    // Initialize generation service
    const generationService = new GenerationService(locals.supabase);

    // Process image and generate flashcards
    const generationResult: GenerationSessionDTO = await generationService.generateFlashcardsFromImage(
      DEFAULT_USER_ID,
      command.image
    );

    // Return successful response
    return new Response(JSON.stringify(generationResult), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing generation request:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
