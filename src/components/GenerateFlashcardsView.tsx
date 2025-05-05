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
          throw new Error(errorData?.message || "Failed to generate flashcards. Please try again.");
        }

        return await response.json();
      } catch (error) {
        if (retries < MAX_RETRIES && error instanceof Error && error.message.includes("network")) {
          retries++;
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY * retries));
          return attemptGeneration();
        }
        throw error;
      }
    };

    try {
      const data = await attemptGeneration();
      setState((prev) => ({
        ...prev,
        loading: false,
        sessionId: data.id,
        flashcards: data.flashcards || [],
        error: data.errors?.length ? data.errors.map((e) => e.errorMessage).join(", ") : null,
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
    async (flashcard: GeneratedFlashcardDTO, actionType: LogFlashcardActionCommand["actionType"]) => {
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
          throw new Error("Failed to process flashcard action. Please try again.");
        }

        // Remove the flashcard from the list if it was rejected or accepted
        if (actionType === "rejected" || actionType === "accepted") {
          setState((prev) => ({
            ...prev,
            flashcards: prev.flashcards.filter((f) => f !== flashcard),
          }));

          // Announce action to screen readers
          toast.success(`Flashcard ${actionType} successfully`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        setState((prev) => ({
          ...prev,
          error: errorMessage,
        }));
        toast.error(errorMessage);
      }
    },
    [state.sessionId]
  );

  const handleAccept = useCallback(
    (flashcard: GeneratedFlashcardDTO) => handleFlashcardAction(flashcard, "accepted"),
    [handleFlashcardAction]
  );

  const handleEdit = useCallback(
    (flashcard: GeneratedFlashcardDTO) => handleFlashcardAction(flashcard, "edited"),
    [handleFlashcardAction]
  );

  const handleDelete = useCallback(
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
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
