import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { CreateFlashcardCommand, FlashcardDTO } from "../types";
import { toast } from "sonner";

interface ManualFlashcardFormProps {
  onAdd: (flashcard: FlashcardDTO) => void;
}

export function ManualFlashcardForm({ onAdd }: ManualFlashcardFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateFlashcardCommand>({
    front: "",
    back: "",
    phonetic: null,
    tags: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.front.trim() || !formData.back.trim()) {
      toast.error("Front and back of the flashcard are required");
      return;
    }

    if (formData.tags.length > 4) {
      toast.error("Maximum 4 tags are allowed");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/flashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create flashcard");
      }

      const newFlashcard = await response.json();
      onAdd(newFlashcard);

      // Reset form
      setFormData({
        front: "",
        back: "",
        phonetic: null,
        tags: [],
      });

      toast.success("Flashcard created successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create flashcard");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTagsChange = (value: string) => {
    const tags = value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    setFormData((prev) => ({ ...prev, tags }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Flashcard</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} id="manual-flashcard-form" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="front">Front</Label>
            <Textarea
              id="front"
              placeholder="Enter the front side of your flashcard"
              value={formData.front}
              onChange={(e) => setFormData((prev) => ({ ...prev, front: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="back">Back</Label>
            <Textarea
              id="back"
              placeholder="Enter the back side of your flashcard"
              value={formData.back}
              onChange={(e) => setFormData((prev) => ({ ...prev, back: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phonetic">Phonetic (optional)</Label>
            <Input
              id="phonetic"
              placeholder="Enter phonetic transcription"
              value={formData.phonetic || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, phonetic: e.target.value || null }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated, max 4)</Label>
            <Input
              id="tags"
              placeholder="Enter tags, separated by commas"
              value={formData.tags.join(", ")}
              onChange={(e) => handleTagsChange(e.target.value)}
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Creating..." : "Create Flashcard"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
