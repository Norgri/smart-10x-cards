import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function EmptyState() {
  return (
    <Card className="p-8 text-center">
      <div className="mb-6">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold mb-2">You have no flashcards yet!</h3>
      <p className="text-muted-foreground mb-6">
        Get started by creating your first flashcard or generate them using AI.
      </p>
      <div className="flex justify-center gap-4">
        <Button variant="default" onClick={() => document.getElementById("manual-flashcard-form")?.focus()}>
          Add Flashcard
        </Button>
        <Button variant="outline" onClick={() => (window.location.href = "/generate")}>
          Generate Flashcards
        </Button>
      </div>
    </Card>
  );
}
