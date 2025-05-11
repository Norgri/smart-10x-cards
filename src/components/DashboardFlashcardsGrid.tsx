import type { FlashcardDTO } from "../types";
import { DashboardFlashcardItem } from "./DashboardFlashcardItem";

interface DashboardFlashcardsGridProps {
  flashcards: FlashcardDTO[];
  onEdit: (flashcard: FlashcardDTO) => void;
  onDelete: (id: number) => void;
}

export function DashboardFlashcardsGrid({ flashcards, onEdit, onDelete }: DashboardFlashcardsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" role="list" aria-label="Flashcards grid">
      {flashcards.map((flashcard) => (
        <div key={flashcard.id} role="listitem">
          <DashboardFlashcardItem flashcard={flashcard} onEdit={onEdit} onDelete={onDelete} />
        </div>
      ))}
    </div>
  );
}
