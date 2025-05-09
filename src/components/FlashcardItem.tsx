import { useState } from "react";
import type { GeneratedFlashcardDTO } from "../types";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Alert, AlertDescription } from "./ui/alert";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

interface FlashcardItemProps {
  flashcard: GeneratedFlashcardDTO;
  onAccept: () => void;
  onEdit: (updatedFlashcard: GeneratedFlashcardDTO) => void;
  onReject: () => void;
}

interface EditableFlashcard {
  front: string;
  back: string;
  phonetic: string;
  tags: string;
}

export function FlashcardItem({ flashcard, onAccept, onEdit, onReject }: FlashcardItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<EditableFlashcard>({
    front: flashcard.front,
    back: flashcard.back,
    phonetic: flashcard.phonetic || "",
    tags: flashcard.tags.join(", "),
  });

  const handleSave = () => {
    try {
      // Validate required fields
      if (!editedData.front.trim() || !editedData.back.trim()) {
        setError("Front and back text are required");
        return;
      }

      // Parse and validate tags
      const tags = editedData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      if (tags.length > 4) {
        setError("Maximum 4 tags are allowed");
        return;
      }

      // Validate tag length
      const invalidTags = tags.filter((tag) => tag.length > 50);
      if (invalidTags.length > 0) {
        setError(`Tags must be shorter than 50 characters: ${invalidTags.join(", ")}`);
        return;
      }

      // Create updated flashcard
      const updatedFlashcard: GeneratedFlashcardDTO = {
        ...flashcard,
        front: editedData.front.trim(),
        back: editedData.back.trim(),
        phonetic: editedData.phonetic.trim() || null,
        tags,
      };

      onEdit(updatedFlashcard);
      setIsEditing(false);
      setError(null);
      toast.success("Flashcard updated successfully");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update flashcard";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    setEditedData({
      front: flashcard.front,
      back: flashcard.back,
      phonetic: flashcard.phonetic || "",
      tags: flashcard.tags.join(", "),
    });
    setIsEditing(false);
    setError(null);
  };

  if (isEditing) {
    return (
      <Card>
        <CardHeader className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium" id="front-label">
              Front
            </h3>
            <Textarea
              value={editedData.front}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setEditedData((prev) => ({ ...prev, front: e.target.value }))
              }
              placeholder="Front text"
              className="resize-none"
              aria-labelledby="front-label"
              aria-required="true"
            />
          </div>
          <div className="space-y-2">
            <h3 className="font-medium" id="back-label">
              Back
            </h3>
            <Textarea
              value={editedData.back}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setEditedData((prev) => ({ ...prev, back: e.target.value }))
              }
              placeholder="Back text"
              className="resize-none"
              aria-labelledby="back-label"
              aria-required="true"
            />
          </div>
          <div className="space-y-2">
            <h3 className="font-medium" id="phonetic-label">
              Phonetic (optional)
            </h3>
            <Input
              value={editedData.phonetic}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEditedData((prev) => ({ ...prev, phonetic: e.target.value }))
              }
              placeholder="Phonetic transcription"
              aria-labelledby="phonetic-label"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <h3 className="font-medium" id="tags-label">
              Tags (comma-separated, max 4)
            </h3>
            <Input
              value={editedData.tags}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEditedData((prev) => ({ ...prev, tags: e.target.value }))
              }
              placeholder="tag1, tag2, tag3, tag4"
              aria-labelledby="tags-label"
              aria-describedby="tags-description"
            />
            <p id="tags-description" className="text-xs text-muted-foreground">
              Enter up to 4 tags, separated by commas. Each tag must be less than 50 characters.
            </p>
          </div>
          {error && (
            <Alert variant="destructive" className="mt-4" role="alert" aria-live="assertive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={handleCancel}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            Save
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-medium" id="front-content">
            Front
          </h3>
          <p className="text-sm" aria-labelledby="front-content">
            {flashcard.front}
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="font-medium" id="back-content">
            Back
          </h3>
          <p className="text-sm" aria-labelledby="back-content">
            {flashcard.back}
          </p>
        </div>
        {flashcard.phonetic && (
          <div className="space-y-2">
            <h3 className="font-medium" id="phonetic-content">
              Phonetic
            </h3>
            <p className="text-sm font-mono" aria-labelledby="phonetic-content">
              {flashcard.phonetic}
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2" role="list" aria-label="Flashcard tags">
          {flashcard.tags.map((tag) => (
            <Badge key={tag} variant="secondary" role="listitem">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">
              Reject
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reject this flashcard?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This flashcard will be marked as rejected and removed from the list.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onReject}>Reject</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} aria-label="Edit flashcard">
          Edit
        </Button>
        <Button size="sm" onClick={onAccept} aria-label="Accept flashcard">
          Accept
        </Button>
      </CardFooter>
    </Card>
  );
}
