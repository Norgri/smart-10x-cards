import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../db/database.types";
import type { CreateFlashcardCommand, FlashcardDTO, UpdateFlashcardCommand } from "../../types";

type FlashcardRecord = Database["public"]["Tables"]["flashcards"]["Row"];
type TagRecord = Database["public"]["Tables"]["tags"]["Row"];
type FlashcardInsert = Database["public"]["Tables"]["flashcards"]["Insert"];
type TagInsert = Database["public"]["Tables"]["tags"]["Insert"];

type FlashcardWithTags = FlashcardRecord & {
  tags: TagRecord[];
};

export class FlashcardService {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  /**
   * Retrieves a paginated list of flashcards with optional tag filtering
   */
  async listFlashcards(
    userId: string,
    page: number,
    limit: number,
    tags?: string[]
  ): Promise<{ data: FlashcardDTO[]; total: number }> {
    const offset = (page - 1) * limit;

    let flashcardIdsToFilterBy: number[] | undefined = undefined;

    if (tags && tags.length > 0) {
      // Step 1: Fetch flashcard_ids that match the tags for the current user.
      // RLS on `tags` table (via `flashcards`) ensures we only get tags for user's flashcards.
      const { data: matchingTagEntries, error: tagsError } = await this.supabase
        .from("tags")
        .select("flashcard_id")
        .in("tag", tags);

      if (tagsError) {
        console.error("Error fetching flashcard IDs by tags:", tagsError);
        throw new Error(`Failed to fetch flashcard IDs by tags: ${tagsError.message}`);
      }

      if (!matchingTagEntries || matchingTagEntries.length === 0) {
        // If specific tags are requested and no flashcards have these tags, return empty.
        return { data: [], total: 0 };
      }
      // Get unique flashcard_ids that have at least one of the matching tags
      flashcardIdsToFilterBy = [...new Set(matchingTagEntries.map((t) => t.flashcard_id))];

      if (flashcardIdsToFilterBy.length === 0) {
        // This case should ideally be covered by the check above, but as a safeguard:
        return { data: [], total: 0 };
      }
    }

    // Step 2: Fetch the actual flashcards
    // Start building the main query for flashcards
    let query = this.supabase
      .from("flashcards")
      .select("*, tags(*)", { count: "exact" }) // Select ALL tags for matched flashcards
      .eq("user_id", userId);

    // If we have specific flashcard IDs from tag filtering, apply them
    if (flashcardIdsToFilterBy) {
      query = query.in("id", flashcardIdsToFilterBy);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching flashcards:", error);
      throw new Error(`Failed to fetch flashcards: ${error.message}`);
    }

    // Transform the data to match FlashcardDTO structure
    const flashcards: FlashcardDTO[] = (data as FlashcardWithTags[]).map((flashcard) => ({
      id: flashcard.id,
      front: flashcard.front,
      back: flashcard.back,
      phonetic: flashcard.phonetic,
      source: flashcard.source as "manual" | "ai",
      createdAt: flashcard.created_at,
      updatedAt: flashcard.updated_at,
      userId: flashcard.user_id,
      tags: flashcard.tags.map((tag) => tag.tag),
    }));

    return {
      data: flashcards,
      total: count || 0,
    };
  }

  /**
   * Retrieves a single flashcard by ID
   */
  async getFlashcard(userId: string, id: number): Promise<FlashcardDTO | null> {
    const { data, error } = await this.supabase
      .from("flashcards")
      .select("*, tags(*)")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw new Error(`Failed to fetch flashcard: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    const flashcard = data as FlashcardWithTags;

    return {
      id: flashcard.id,
      front: flashcard.front,
      back: flashcard.back,
      phonetic: flashcard.phonetic,
      source: flashcard.source as "manual" | "ai",
      createdAt: flashcard.created_at,
      updatedAt: flashcard.updated_at,
      userId: flashcard.user_id,
      tags: flashcard.tags.map((tag) => tag.tag),
    };
  }

  /**
   * Creates a new flashcard with tags
   */
  async createFlashcard(userId: string, command: CreateFlashcardCommand): Promise<FlashcardDTO> {
    const { data: flashcard, error: flashcardError } = await this.supabase
      .from("flashcards")
      .insert({
        front: command.front,
        back: command.back,
        phonetic: command.phonetic,
        source: "manual",
        user_id: userId,
      } satisfies FlashcardInsert)
      .select()
      .single();

    if (flashcardError) {
      throw new Error(`Failed to create flashcard: ${flashcardError.message}`);
    }

    if (command.tags.length > 0) {
      const tagInserts: TagInsert[] = command.tags.map((tag) => ({
        flashcard_id: flashcard.id,
        tag,
      }));

      const { error: tagsError } = await this.supabase.from("tags").insert(tagInserts);

      if (tagsError) {
        // If tags creation fails, delete the flashcard to maintain consistency
        await this.supabase.from("flashcards").delete().eq("id", flashcard.id);
        throw new Error(`Failed to create tags: ${tagsError.message}`);
      }
    }

    // Fetch the complete flashcard with tags
    return (await this.getFlashcard(userId, flashcard.id)) as FlashcardDTO;
  }

  /**
   * Updates an existing flashcard and its tags
   */
  async updateFlashcard(userId: string, command: UpdateFlashcardCommand): Promise<FlashcardDTO> {
    // Verify flashcard exists and belongs to user
    const existing = await this.getFlashcard(userId, command.id);
    if (!existing) {
      throw new Error("Flashcard not found or access denied");
    }

    // Update flashcard
    const { error: flashcardError } = await this.supabase
      .from("flashcards")
      .update({
        front: command.front,
        back: command.back,
        phonetic: command.phonetic,
      })
      .eq("id", command.id)
      .eq("user_id", userId);

    if (flashcardError) {
      throw new Error(`Failed to update flashcard: ${flashcardError.message}`);
    }

    // Delete existing tags
    const { error: deleteTagsError } = await this.supabase.from("tags").delete().eq("flashcard_id", command.id);

    if (deleteTagsError) {
      throw new Error(`Failed to update tags: ${deleteTagsError.message}`);
    }

    // Insert new tags
    if (command.tags.length > 0) {
      const tagInserts: TagInsert[] = command.tags.map((tag) => ({
        flashcard_id: command.id,
        tag,
      }));

      const { error: insertTagsError } = await this.supabase.from("tags").insert(tagInserts);

      if (insertTagsError) {
        throw new Error(`Failed to update tags: ${insertTagsError.message}`);
      }
    }

    // Fetch the updated flashcard with tags
    return (await this.getFlashcard(userId, command.id)) as FlashcardDTO;
  }

  /**
   * Deletes a flashcard and its associated tags
   */
  async deleteFlashcard(userId: string, id: number): Promise<void> {
    // Verify flashcard exists and belongs to user
    const existing = await this.getFlashcard(userId, id);
    if (!existing) {
      throw new Error("Flashcard not found or access denied");
    }

    // Delete the flashcard (tags will be deleted automatically due to foreign key constraint)
    const { error } = await this.supabase.from("flashcards").delete().eq("id", id).eq("user_id", userId);

    if (error) {
      throw new Error(`Failed to delete flashcard: ${error.message}`);
    }
  }
}
