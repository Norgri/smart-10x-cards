/**
 * DTO and Command Models for the API.
 *
 * These types are built based on the API plan (api-plan.md) and the database models (src/db/database.types.ts).
 * They use explicit property picking (via TypeScript utility types) to ensure only allowed fields are present,
 * avoiding the use of Omit for security reasons.
 *
 * Note:
 * - Database fields in snake_case are converted to camelCase in these DTOs.
 * - Flashcard related types include a "tags" field represented as an array of strings.
 */

/**
 * FlashcardDTO represents a flashcard retrieved from the database.
 * Derived from the 'flashcards' table in the database.
 */
export interface FlashcardDTO {
  id: number;
  front: string;
  back: string;
  phonetic: string | null;
  source: "manual" | "ai";
  createdAt: string; // corresponds to created_at in the DB
  updatedAt: string; // corresponds to updated_at in the DB
  userId: string; // corresponds to user_id in the DB
  tags: string[]; // Array of tags associated with the flashcard (max 4)
}

/**
 * ListFlashcardsResponse represents the full response from the API when retrieving a list of flashcards
 */
export interface ListFlashcardsResponse {
  data: FlashcardDTO[];
  total: number;
}

/**
 * CreateFlashcardCommand is used when creating a new manual flashcard.
 * It picks only the necessary fields from FlashcardDTO and adds the 'tags' field explicitly.
 */
export interface CreateFlashcardCommand {
  front: string;
  back: string;
  phonetic?: string | null;
  tags: string[]; // Should contain at most 4 tags
}

/**
 * UpdateFlashcardCommand is used to update an existing flashcard.
 * It requires the flashcard's id along with the editable fields.
 */
export interface UpdateFlashcardCommand {
  id: number;
  front: string;
  back: string;
  phonetic?: string | null;
  tags: string[]; // Should contain at most 4 tags
}

/**
 * DeleteFlashcardCommand is used to delete a flashcard by its id.
 */
export interface DeleteFlashcardCommand {
  id: number;
}

/**
 * GeneratedFlashcardDTO represents a flashcard generated via the AI process.
 */
export interface GeneratedFlashcardDTO {
  front: string;
  back: string;
  phonetic?: string | null;
  tags: string[];
  source: "ai";
}

/**
 * GenerationSessionDTO represents a session in which flashcards were generated using AI.
 * It is derived from the 'generation_session' table and includes the generated flashcards.
 */
export interface GenerationSessionDTO {
  id?: number | null; // API sample uses a string, e.g., "123"
  flashcards?: GeneratedFlashcardDTO[];
  errors?: Pick<GenerationErrorDTO, "id" | "errorCode" | "errorMessage">[];
  createdAt: string; // corresponds to created_at in the DB
}

/**
 * GenerateFlashcardsFromImageCommand is used to initiate an AI flashcard generation session.
 * It encapsulates the image file and optional generation parameters.
 */
export interface GenerateFlashcardsFromImageCommand {
  image: File; // The uploaded image file (JPG or PNG)
}

/**
 * GenerationErrorDTO represents an error encountered during an AI generation session.
 * Derived from the 'generation_error' table in the database.
 */
export interface GenerationErrorDTO {
  id: number;
  sessionId: number; // Converted to string for API consistency
  errorCode: string;
  errorMessage: string;
  createdAt: string; // corresponds to created_at in the DB
}

/**
 * LogFlashcardActionCommand is used to log an action performed on a generated flashcard.
 * It is used in the endpoint for logging flashcard actions.
 */
export interface LogFlashcardActionCommand {
  actionType: "accepted" | "edited" | "rejected";
  generatedFlashcard?: GeneratedFlashcardDTO;
}

/**
 * LogActionDTO represents the response payload after logging a flashcard action.
 * Derived from the 'log_action' table in the database.
 */
export interface LogActionDTO {
  id: number;
  sessionId: number;
  flashcardId?: number;
  actionType: "accepted" | "edited" | "rejected";
  timestamp: string; // Represents when the action was logged
}

/**
 * EditFlashcardValidation represents validation rules for editing a flashcard.
 */
export interface EditFlashcardValidation {
  maxTags: number;
  maxTagLength: number;
  requiredFields: (keyof Pick<GeneratedFlashcardDTO, "front" | "back">)[];
}

// Auth API Types
export interface AuthResponse {
  user: {
    id: string;
    email: string | null;
  } | null;
  error?: string;
  redirectTo?: string;
}

export interface AuthErrorResponse {
  error: string;
  details?: unknown;
}

// Login Command
export interface LoginCommand {
  email: string;
  password: string;
}
