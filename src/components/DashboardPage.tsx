import { useState, useEffect, useCallback } from "react";
import type { FlashcardDTO } from "../types";
import { ManualFlashcardForm } from "./ManualFlashcardForm";
import { SearchBar } from "./SearchBar";
import { DashboardFlashcardsGrid } from "./DashboardFlashcardsGrid";
import { EmptyState } from "./EmptyState";
import { Spinner } from "./ui/spinner";
import { Alert, AlertDescription } from "./ui/alert";
import { toast } from "sonner";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

type NetworkOperation<T> = () => Promise<T>;

export function DashboardPage() {
  const [flashcards, setFlashcards] = useState<FlashcardDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [retryCount, setRetryCount] = useState(0);

  // Function to handle network errors with retries
  const handleNetworkError = useCallback(
    async <T,>(operation: NetworkOperation<T>, errorMessage: string): Promise<T> => {
      try {
        return await operation();
      } catch (err) {
        if (
          retryCount < MAX_RETRIES &&
          ((err instanceof Error && err.message.includes("network")) ||
            (err instanceof TypeError && err.message.includes("failed to fetch")))
        ) {
          setRetryCount((prev) => prev + 1);
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));
          return handleNetworkError(operation, errorMessage);
        }

        const message = err instanceof Error ? err.message : errorMessage;
        setError(message);
        toast.error(message);
        throw err;
      }
    },
    [retryCount]
  );

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setRetryCount(0);

        const queryParams = selectedTags.length ? `?tags=${selectedTags.join(",")}` : "";

        const response = await handleNetworkError(
          () => fetch(`/api/flashcards${queryParams}`),
          "Failed to fetch flashcards. Please check your connection and try again."
        );

        if (!response.ok) {
          throw new Error(
            response.status === 429
              ? "Too many requests. Please wait a moment and try again."
              : "Failed to fetch flashcards. Please try again later."
          );
        }

        const data = await response.json();
        setFlashcards(data);
      } catch {
        // Error is already handled by handleNetworkError
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlashcards();
  }, [selectedTags, retryCount, handleNetworkError]);

  const handleAddFlashcard = async (newFlashcard: FlashcardDTO) => {
    setFlashcards((prev) => [...prev, newFlashcard]);
  };

  const handleEditFlashcard = async (editedFlashcard: FlashcardDTO) => {
    try {
      await handleNetworkError(
        () =>
          fetch(`/api/flashcards/${editedFlashcard.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(editedFlashcard),
          }),
        "Failed to update flashcard. Please check your connection and try again."
      );

      setFlashcards((prev) => prev.map((card) => (card.id === editedFlashcard.id ? editedFlashcard : card)));
      toast.success("Flashcard updated successfully");
    } catch {
      // Error is already handled by handleNetworkError
    }
  };

  const handleDeleteFlashcard = async (id: number) => {
    try {
      await handleNetworkError(
        () =>
          fetch(`/api/flashcards/${id}`, {
            method: "DELETE",
          }),
        "Failed to delete flashcard. Please check your connection and try again."
      );

      setFlashcards((prev) => prev.filter((card) => card.id !== id));
      toast.success("Flashcard deleted successfully");
    } catch {
      // Error is already handled by handleNetworkError
    }
  };

  const handleTagsChange = (tags: string[]) => {
    setSelectedTags(tags);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Flashcards</h1>

      <section className="mb-8">
        <ManualFlashcardForm onAdd={handleAddFlashcard} />
      </section>

      <section className="mb-8">
        <SearchBar onTagsChange={handleTagsChange} selectedTags={selectedTags} />
      </section>

      {isLoading ? (
        <div className="flex justify-center">
          <Spinner className="h-8 w-8" />
        </div>
      ) : error ? (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : flashcards.length === 0 ? (
        <EmptyState />
      ) : (
        <DashboardFlashcardsGrid
          flashcards={flashcards}
          onEdit={handleEditFlashcard}
          onDelete={handleDeleteFlashcard}
        />
      )}
    </main>
  );
}
