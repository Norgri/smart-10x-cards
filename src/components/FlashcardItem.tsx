import { useState } from "react";
import type { GeneratedFlashcardDTO } from "../types";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Alert, AlertDescription } from "./ui/alert";

interface FlashcardItemProps {
  flashcard: GeneratedFlashcardDTO;
  onAccept: () => void;
  onEdit: (updatedFlashcard: GeneratedFlashcardDTO) => void;
  onDelete: () => void;
}

interface EditableFlashcard {
  front: string;
  back: string;
  phonetic: string;
  tags: string;
}

export function FlashcardItem({ flashcard, onAccept, onEdit, onDelete }: FlashcardItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<EditableFlashcard>({
    front: flashcard.front,
    back: flashcard.back,
    phonetic: flashcard.phonetic || "",
    tags: flashcard.tags.join(", "),
  });

  const handleSave = () => {
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
            <h3 className="font-medium">Front</h3>
            <Textarea
              value={editedData.front}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setEditedData((prev) => ({ ...prev, front: e.target.value }))
              }
              placeholder="Front text"
              className="resize-none"
            />
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Back</h3>
            <Textarea
              value={editedData.back}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setEditedData((prev) => ({ ...prev, back: e.target.value }))
              }
              placeholder="Back text"
              className="resize-none"
            />
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Phonetic (optional)</h3>
            <Input
              value={editedData.phonetic}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEditedData((prev) => ({ ...prev, phonetic: e.target.value }))
              }
              placeholder="Phonetic transcription"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <h3 className="font-medium">Tags (comma-separated, max 4)</h3>
            <Input
              value={editedData.tags}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEditedData((prev) => ({ ...prev, tags: e.target.value }))
              }
              placeholder="tag1, tag2, tag3, tag4"
            />
          </div>
          {error && (
            <Alert variant="destructive" className="mt-4">
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
          <h3 className="font-medium">Front</h3>
          <p className="text-sm">{flashcard.front}</p>
        </div>
        <div className="space-y-2">
          <h3 className="font-medium">Back</h3>
          <p className="text-sm">{flashcard.back}</p>
        </div>
        {flashcard.phonetic && (
          <div className="space-y-2">
            <h3 className="font-medium">Phonetic</h3>
            <p className="text-sm font-mono">{flashcard.phonetic}</p>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {flashcard.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onDelete}>
          Delete
        </Button>
        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
          Edit
        </Button>
        <Button size="sm" onClick={onAccept}>
          Accept
        </Button>
      </CardFooter>
    </Card>
  );
}
