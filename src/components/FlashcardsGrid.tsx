import { memo, useCallback } from "react";
import type { GeneratedFlashcardDTO } from "../types";
import { FlashcardItem } from "./FlashcardItem";

interface FlashcardsGridProps {
  flashcards: GeneratedFlashcardDTO[];
  sessionId: string;
  onAccept: (flashcard: GeneratedFlashcardDTO) => void;
  onEdit: (flashcard: GeneratedFlashcardDTO) => void;
  onDelete: (flashcard: GeneratedFlashcardDTO) => void;
}

function FlashcardsGridComponent({ flashcards, sessionId, onAccept, onEdit, onDelete }: FlashcardsGridProps) {
  const handleAccept = useCallback(
    (flashcard: GeneratedFlashcardDTO) => {
      onAccept(flashcard);
    },
    [onAccept]
  );

  const handleEdit = useCallback(
    (flashcard: GeneratedFlashcardDTO) => {
      onEdit(flashcard);
    },
    [onEdit]
  );

  const handleDelete = useCallback(
    (flashcard: GeneratedFlashcardDTO) => {
      onDelete(flashcard);
    },
    [onDelete]
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
            onEdit={() => handleEdit(flashcard)}
            onDelete={() => handleDelete(flashcard)}
          />
        </div>
      ))}
    </div>
  );
}

export const FlashcardsGrid = memo(FlashcardsGridComponent);
