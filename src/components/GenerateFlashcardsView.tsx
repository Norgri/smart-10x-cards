import { useState, useCallback } from "react";
import type { GeneratedFlashcardDTO, GenerationSessionDTO, LogFlashcardActionCommand } from "../types";
import { UploadSection } from "./UploadSection";
import { Spinner } from "./ui/spinner";
import { Alert, AlertDescription } from "./ui/alert";
import { FlashcardsGrid } from "./FlashcardsGrid";
import { toast } from "sonner";

interface FlashcardsViewState {
  loading: boolean;
  error: string | null;
  flashcards: GeneratedFlashcardDTO[];
  sessionId: string | null;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export function GenerateFlashcardsView() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [state, setState] = useState<FlashcardsViewState>({
    loading: false,
    error: null,
    flashcards: [],
    sessionId: null,
  });

  const handleFileSelect = useCallback(
    (file: File | null) => {
      setSelectedFile(file);
      // Reset error state when new file is selected
      if (state.error) {
        setState((prev) => ({ ...prev, error: null }));
      }
    },
    [state.error]
  );

  const handleGenerate = useCallback(async () => {
    if (!selectedFile) {
      setState((prev) => ({ ...prev, error: "Please select an image file" }));
      return;
    }

    let retries = 0;

    const attemptGeneration = async (): Promise<GenerationSessionDTO> => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const formData = new FormData();
        formData.append("image", selectedFile);

        const response = await fetch("/api/generation-sessions", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          const errorMessage =
            errorData?.message || response.status === 413
              ? "File is too large. Maximum size is 10MB."
              : response.status === 415
                ? "Invalid file type. Please select a JPEG or PNG image."
                : response.status === 429
                  ? "Too many requests. Please try again later."
                  : "Failed to generate flashcards. Please try again.";
          throw new Error(errorMessage);
        }

        const data = await response.json();

        // Validate response data
        if (!data || typeof data !== "object") {
          throw new Error("Invalid response from server");
        }

        return data;
      } catch (error) {
        if (
          retries < MAX_RETRIES &&
          ((error instanceof Error && error.message.includes("network")) ||
            (error instanceof TypeError && error.message.includes("failed to fetch")))
        ) {
          retries++;
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY * retries));
          return attemptGeneration();
        }
        throw error;
      }
    };

    try {
      const data = await attemptGeneration();

      if (data.errors?.length) {
        const errorMessages = data.errors.map((e) => {
          switch (e.errorCode) {
            case "IMAGE_PROCESSING_ERROR":
              return "Failed to process the image. Please try a different image.";
            case "AI_SERVICE_ERROR":
              return "AI service is temporarily unavailable. Please try again later.";
            default:
              return e.errorMessage;
          }
        });

        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessages.join(", "),
        }));
        return;
      }

      setState((prev) => ({
        ...prev,
        loading: false,
        sessionId: data.id?.toString() || null,
        flashcards: data.flashcards || [],
        error: null,
      }));

      // Announce success to screen readers
      const successMessage = `Successfully generated ${data.flashcards?.length || 0} flashcards`;
      toast.success(successMessage);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      toast.error(errorMessage);
    }
  }, [selectedFile]);

  const handleFlashcardAction = useCallback(
    async (
      flashcard: GeneratedFlashcardDTO,
      actionType: LogFlashcardActionCommand["actionType"],
      originalFlashcard?: GeneratedFlashcardDTO
    ) => {
      if (!state.sessionId) return;

      try {
        const response = await fetch(`/api/generation-sessions/${state.sessionId}/flashcard-actions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            actionType,
            generatedFlashcard: flashcard,
          } satisfies LogFlashcardActionCommand),
        });

        if (!response.ok) {
          let errorMessage = "Failed to process flashcard action. Please try again.";

          try {
            const errorData = await response.json();
            if (errorData?.message) {
              errorMessage = errorData.message;
            } else {
              switch (response.status) {
                case 400:
                  errorMessage =
                    actionType === "edited"
                      ? "Invalid flashcard data. Please check your input and try again."
                      : "Invalid request. Please try again.";
                  break;
                case 404:
                  errorMessage = "Session not found. Please refresh the page and try again.";
                  break;
                case 429:
                  errorMessage = "Too many requests. Please wait a moment and try again.";
                  break;
                case 500:
                  errorMessage = "Server error. Please try again later.";
                  break;
              }
            }
          } catch {
            // Use default error message if JSON parsing fails
          }

          throw new Error(errorMessage);
        }
        const toRemove = actionType === "edited" && originalFlashcard ? originalFlashcard : flashcard;
        setState((prev) => ({
          ...prev,
          flashcards: prev.flashcards.filter((f) => f !== toRemove),
        }));
        toast.success(`Flashcard ${actionType} successfully`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        setState((prev) => ({
          ...prev,
          error: errorMessage,
        }));
        toast.error(errorMessage);

        // On edit failure, leave flashcards array unchanged (original card remains)
      }
    },
    [state.sessionId]
  );

  const handleAccept = useCallback(
    (flashcard: GeneratedFlashcardDTO) => handleFlashcardAction(flashcard, "accepted"),
    [handleFlashcardAction]
  );

  const handleEdit = useCallback(
    (updatedFlashcard: GeneratedFlashcardDTO, originalFlashcard: GeneratedFlashcardDTO) =>
      handleFlashcardAction(updatedFlashcard, "edited", originalFlashcard),
    [handleFlashcardAction]
  );

  const handleReject = useCallback(
    (flashcard: GeneratedFlashcardDTO) => handleFlashcardAction(flashcard, "rejected"),
    [handleFlashcardAction]
  );

  return (
    <div className="space-y-8" role="region" aria-label="Flashcard Generation">
      <UploadSection
        selectedFile={selectedFile}
        onFileSelect={handleFileSelect}
        onGenerate={handleGenerate}
        disabled={state.loading}
      />

      {state.loading && (
        <div className="flex justify-center" role="status" aria-live="polite" aria-busy="true">
          <Spinner className="w-8 h-8" />
          <span className="sr-only">Generating flashcards...</span>
        </div>
      )}

      {state.error && (
        <Alert variant="destructive" role="alert" aria-live="assertive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {state.flashcards.length > 0 && state.sessionId && (
        <FlashcardsGrid
          flashcards={state.flashcards}
          sessionId={state.sessionId}
          onAccept={handleAccept}
          onEdit={handleEdit}
          onReject={handleReject}
        />
      )}
    </div>
  );
}
