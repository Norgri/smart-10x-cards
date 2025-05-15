import { useState, useEffect, useCallback } from "react";
import type { FlashcardDTO, ListFlashcardsResponse } from "../types";
import { ManualFlashcardForm } from "./ManualFlashcardForm";
import { SearchBar } from "./SearchBar";
import { DashboardFlashcardsGrid } from "./DashboardFlashcardsGrid";
import { EmptyState } from "./EmptyState";
import { Spinner } from "./ui/spinner";
import { Alert, AlertDescription } from "./ui/alert";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

type NetworkOperation<T> = () => Promise<T>;

export function DashboardPage() {
  const [flashcards, setFlashcards] = useState<FlashcardDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [retryCount, setRetryCount] = useState(0);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);

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
          toast.info(`Connection issue detected. Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
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
          let errorMessage = "Failed to fetch flashcards. Please try again later.";

          try {
            const errorData = await response.json();
            if (errorData && errorData.message) {
              errorMessage = errorData.message;
            }
          } catch {
            // If JSON parsing fails, use status code based messages
            errorMessage =
              response.status === 429
                ? "Too many requests. Please wait a moment and try again."
                : response.status === 401
                  ? "You are not authorized to view these flashcards. Please log in again."
                  : response.status === 403
                    ? "You don't have permission to access these flashcards."
                    : response.status === 404
                      ? "No flashcards found with the selected tags."
                      : response.status >= 500
                        ? "Server error. Our team has been notified."
                        : errorMessage;
          }

          throw new Error(errorMessage);
        }

        const responseData: ListFlashcardsResponse = await response.json();
        setFlashcards(responseData.data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred while fetching flashcards.");
        }
        // Error toast is handled by handleNetworkError
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlashcards();
  }, [selectedTags, retryCount, handleNetworkError]);

  const handleAddFlashcard = async (newFlashcard: FlashcardDTO) => {
    setFlashcards((prev) => [...prev, newFlashcard]);
    setIsFormDialogOpen(false);
    toast.success("Flashcard created successfully");
  };

  const handleEditFlashcard = async (editedFlashcard: FlashcardDTO) => {
    // The API call is already handled by DashboardFlashcardItem component
    // Just update the local state with the edited flashcard
    setFlashcards((prev) => prev.map((card) => (card.id === editedFlashcard.id ? editedFlashcard : card)));
    toast.success("Flashcard updated successfully");
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

  const handleOpenFormDialog = () => {
    setIsFormDialogOpen(true);
  };

  return (
    <main className="container mx-auto px-4 py-8" data-testid="dashboard-content">
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold" data-testid="dashboard-title">
            Your Flashcards
          </h1>
          <Button onClick={handleOpenFormDialog} className="w-full md:w-auto">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Flashcard
          </Button>
        </div>

        <SearchBar onTagsChange={handleTagsChange} selectedTags={selectedTags} />
      </header>

      {/* Flashcard Form Dialog */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Flashcard</DialogTitle>
          </DialogHeader>
          <ManualFlashcardForm onAdd={handleAddFlashcard} />
        </DialogContent>
      </Dialog>

      {/* Content area with conditional rendering */}
      <ContentContainer
        isLoading={isLoading}
        error={error}
        flashcards={flashcards}
        onOpenFormDialog={handleOpenFormDialog}
        onEdit={handleEditFlashcard}
        onDelete={handleDeleteFlashcard}
      />
    </main>
  );
}

/**
 * Renders the main content section based on application state
 */
function ContentContainer({
  isLoading,
  error,
  flashcards,
  onOpenFormDialog,
  onEdit,
  onDelete,
}: {
  isLoading: boolean;
  error: string | null;
  flashcards: FlashcardDTO[];
  onOpenFormDialog: () => void;
  onEdit: (flashcard: FlashcardDTO) => void;
  onDelete: (id: number) => void;
}) {
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Show empty state when no flashcards
  if (flashcards.length === 0) {
    return <EmptyState onOpenFormDialog={onOpenFormDialog} />;
  }

  // Show flashcards grid (default state)
  return <DashboardFlashcardsGrid flashcards={flashcards} onEdit={onEdit} onDelete={onDelete} />;
}
