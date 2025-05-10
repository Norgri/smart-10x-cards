import { memo, useCallback } from "react";
import type { GeneratedFlashcardDTO } from "../types";
import { FlashcardItem } from "./FlashcardItem";

interface FlashcardsGridProps {
  flashcards: GeneratedFlashcardDTO[];
  sessionId: string;
  onAccept: (flashcard: GeneratedFlashcardDTO) => void;
  onEdit: (updatedFlashcard: GeneratedFlashcardDTO, originalFlashcard: GeneratedFlashcardDTO) => void;
  onReject: (flashcard: GeneratedFlashcardDTO) => void;
}

function FlashcardsGridComponent({ flashcards, sessionId, onAccept, onEdit, onReject }: FlashcardsGridProps) {
  const handleAccept = useCallback(
    (flashcard: GeneratedFlashcardDTO) => {
      onAccept(flashcard);
    },
    [onAccept]
  );

  const handleEdit = useCallback(
    (updatedFlashcard: GeneratedFlashcardDTO, originalFlashcard: GeneratedFlashcardDTO) => {
      onEdit(updatedFlashcard, originalFlashcard);
    },
    [onEdit]
  );

  const handleReject = useCallback(
    (flashcard: GeneratedFlashcardDTO) => {
      onReject(flashcard);
    },
    [onReject]
  );

  if (flashcards.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground" role="status" aria-label="No flashcards available">
        No flashcards to display
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label="Generated flashcards">
      {flashcards.map((flashcard, index) => (
        <div key={`${sessionId}-${index}`} role="listitem">
          <FlashcardItem
            flashcard={flashcard}
            onAccept={() => handleAccept(flashcard)}
            onEdit={(editedFlashcard, originalFlashcard) => handleEdit(editedFlashcard, originalFlashcard)}
            onReject={() => handleReject(flashcard)}
          />
        </div>
      ))}
    </div>
  );
}

export const FlashcardsGrid = memo(FlashcardsGridComponent);
