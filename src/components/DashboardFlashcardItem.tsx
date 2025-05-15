import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2 } from "lucide-react";
import type { FlashcardDTO, UpdateFlashcardCommand } from "../types";
import { toast } from "sonner";
import { ConfirmActionDialog } from "./ConfirmActionDialog";

interface DashboardFlashcardItemProps {
  flashcard: FlashcardDTO;
  onEdit: (flashcard: FlashcardDTO) => void;
  onDelete: (id: number) => void;
}

export function DashboardFlashcardItem({ flashcard, onEdit, onDelete }: DashboardFlashcardItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagsInput, setTagsInput] = useState(flashcard.tags.join(", "));
  const [editData, setEditData] = useState<UpdateFlashcardCommand>({
    id: flashcard.id,
    front: flashcard.front,
    back: flashcard.back,
    phonetic: flashcard.phonetic,
    tags: flashcard.tags,
  });

  const handleEdit = async () => {
    // Validation
    if (!editData.front.trim() || !editData.back.trim()) {
      toast.error("Front and back of the flashcard are required");
      return;
    }

    if (editData.tags.length > 4) {
      toast.error("Maximum 4 tags are allowed");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/flashcards/${flashcard.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        throw new Error("Failed to update flashcard");
      }

      const updatedFlashcard = await response.json();
      onEdit(updatedFlashcard);
      setIsEditing(false);
      toast.success("Flashcard updated successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update flashcard");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTagsChange = (value: string) => {
    setTagsInput(value);
    const tags = value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .slice(0, 4); // Ensure we don't exceed 4 tags
    setEditData((prev) => ({ ...prev, tags }));
  };

  if (isEditing) {
    return (
      <Card className="relative">
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`front-${flashcard.id}`}>Front</Label>
            <Textarea
              id={`front-${flashcard.id}`}
              value={editData.front}
              onChange={(e) => setEditData((prev) => ({ ...prev, front: e.target.value }))}
              placeholder="Front side"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`back-${flashcard.id}`}>Back</Label>
            <Textarea
              id={`back-${flashcard.id}`}
              value={editData.back}
              onChange={(e) => setEditData((prev) => ({ ...prev, back: e.target.value }))}
              placeholder="Back side"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`phonetic-${flashcard.id}`}>Phonetic (optional)</Label>
            <Input
              id={`phonetic-${flashcard.id}`}
              value={editData.phonetic || ""}
              onChange={(e) => setEditData((prev) => ({ ...prev, phonetic: e.target.value || null }))}
              placeholder="Phonetic transcription"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`tags-${flashcard.id}`}>Tags (comma separated, max 4)</Label>
            <Input
              id={`tags-${flashcard.id}`}
              value={tagsInput}
              onChange={(e) => handleTagsChange(e.target.value)}
              placeholder="Enter tags"
            />
          </div>
        </CardContent>

        <CardFooter className="justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="default" size="sm" onClick={handleEdit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="relative">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Front</h3>
            <p className="text-muted-foreground">{flashcard.front}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Back</h3>
            <p className="text-muted-foreground">{flashcard.back}</p>
          </div>

          {flashcard.phonetic && (
            <div>
              <h3 className="font-semibold mb-2">Phonetic</h3>
              <p className="text-muted-foreground">{flashcard.phonetic}</p>
            </div>
          )}

          {flashcard.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {flashcard.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
          <Pencil className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <ConfirmActionDialog
          title="Delete Flashcard"
          description="This action cannot be undone. This will permanently delete the flashcard from your collection."
          actionLabel="Delete"
          triggerLabel="Delete"
          triggerIcon={Trash2}
          triggerVariant="ghost"
          actionVariant="destructive"
          onConfirm={() => onDelete(flashcard.id)}
        />
      </CardFooter>
    </Card>
  );
}
