import type { SupabaseClient } from "@supabase/supabase-js";
import type { LogActionDTO, LogFlashcardActionCommand } from "../../types";

export class FlashcardActionService {
  constructor(private readonly supabase: SupabaseClient) {}

  /**
   * Logs a user action on a generated flashcard and creates a new flashcard record if needed.
   *
   * @param sessionId - The ID of the generation session
   * @param userId - The ID of the user performing the action
   * @param command - The action command containing type and flashcard data
   * @returns The logged action record
   * @throws Error if session doesn't exist or validation fails
   */
  async logFlashcardAction(
    sessionId: string,
    userId: string,
    command: LogFlashcardActionCommand
  ): Promise<LogActionDTO> {
    // Verify if session exists and belongs to user
    const { data: session, error: sessionError } = await this.supabase
      .from("generation_session")
      .select("id")
      .eq("id", sessionId)
      .eq("user_id", userId)
      .single();

    if (sessionError || !session) {
      throw new Error("Generation session not found or access denied");
    }

    // Start a transaction for creating flashcard (if needed) and logging action
    const { data, error } = await this.supabase.rpc("log_flashcard_action", {
      p_session_id: this.convertSessionIdToInteger(sessionId),
      p_user_id: userId,
      p_action_type: command.actionType,
      p_flashcard_data: command.actionType === "rejected" ? null : command.generatedFlashcard,
    });

    if (error) {
      throw new Error(`Failed to log flashcard action: ${error.message}`);
    }

    return {
      id: data.log_id,
      sessionId: data.session_id,
      flashcardId: data.flashcard_id,
      actionType: data.action_type,
      timestamp: data.created_at,
    };
  }
  convertSessionIdToInteger(sessionId: string) {
    const parsedSessionId = Number.parseInt(sessionId, 10);
    if (!Number.isInteger(parsedSessionId) || parsedSessionId <= 0) {
      throw new Error("Invalid session ID");
    }
    return parsedSessionId;
  }
}
