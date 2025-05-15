import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { CreateFlashcardCommand, FlashcardDTO } from "../types";
import { toast } from "sonner";

interface ManualFlashcardFormProps {
  onAdd: (flashcard: FlashcardDTO) => void;
}

// Validation constants
const MAX_FRONT_LENGTH = 500;
const MAX_BACK_LENGTH = 1000;
const MAX_PHONETIC_LENGTH = 200;
const MAX_TAG_LENGTH = 50;
const MAX_TAGS = 4;

export function ManualFlashcardForm({ onAdd }: ManualFlashcardFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<CreateFlashcardCommand>({
    front: "",
    back: "",
    phonetic: null,
    tags: [],
  });

  // Add a state to track the raw tag input for better UX
  const [tagInput, setTagInput] = useState("");

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Check front field
    if (!formData.front.trim()) {
      errors.front = "Front side is required";
    } else if (formData.front.length > MAX_FRONT_LENGTH) {
      errors.front = `Front side cannot exceed ${MAX_FRONT_LENGTH} characters`;
    }

    // Check back field
    if (!formData.back.trim()) {
      errors.back = "Back side is required";
    } else if (formData.back.length > MAX_BACK_LENGTH) {
      errors.back = `Back side cannot exceed ${MAX_BACK_LENGTH} characters`;
    }

    // Check phonetic field if it exists
    if (formData.phonetic && formData.phonetic.length > MAX_PHONETIC_LENGTH) {
      errors.phonetic = `Phonetic transcription cannot exceed ${MAX_PHONETIC_LENGTH} characters`;
    }

    // Check tags
    if (formData.tags.length > MAX_TAGS) {
      errors.tags = `Maximum ${MAX_TAGS} tags are allowed`;
    }

    // Check tag lengths
    const invalidTags = formData.tags.filter((tag) => tag.length > MAX_TAG_LENGTH);
    if (invalidTags.length > 0) {
      errors.tags = `Tag "${invalidTags[0]}" exceeds maximum length of ${MAX_TAG_LENGTH} characters`;
    }

    // Check duplicate tags
    const uniqueTags = new Set(formData.tags);
    if (uniqueTags.size !== formData.tags.length) {
      errors.tags = "Duplicate tags are not allowed";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      // Show the first error as a toast
      const firstError = Object.values(formErrors)[0];
      if (firstError) {
        toast.error(firstError);
      }
      return;
    }

    try {
      setIsSubmitting(true);

      // Ensure tags are properly formatted before sending to API
      const flashcardData = {
        ...formData,
        tags: formData.tags.filter((tag) => tag.trim() !== ""),
      };

      const response = await fetch("/api/flashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(flashcardData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to create flashcard (${response.status})`);
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
      setTagInput("");
      setFormErrors({});
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create flashcard");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTagsChange = (value: string) => {
    setTagInput(value);

    // Split by commas and properly clean the tags
    const tags = value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .slice(0, MAX_TAGS); // Ensure we don't exceed max tags

    // Update form data with the parsed tags array
    setFormData((prev) => ({ ...prev, tags }));

    // Clear tag error when user makes changes
    if (formErrors.tags) {
      setFormErrors((prev) => ({ ...prev, tags: "" }));
    }
  };

  const handleInputChange = (field: keyof CreateFlashcardCommand, value: string | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear field error when user makes changes
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} id="manual-flashcard-form" className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="front" className="flex justify-between">
          <span>Front</span>
          <span className="text-xs text-muted-foreground">
            {formData.front.length}/{MAX_FRONT_LENGTH}
          </span>
        </Label>
        <Textarea
          id="front"
          placeholder="Enter the front side of your flashcard"
          value={formData.front}
          onChange={(e) => handleInputChange("front", e.target.value)}
          className={formErrors.front ? "border-destructive" : ""}
          aria-invalid={!!formErrors.front}
          aria-describedby={formErrors.front ? "front-error" : undefined}
          required
        />
        {formErrors.front && (
          <p id="front-error" className="text-sm text-destructive">
            {formErrors.front}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="back" className="flex justify-between">
          <span>Back</span>
          <span className="text-xs text-muted-foreground">
            {formData.back.length}/{MAX_BACK_LENGTH}
          </span>
        </Label>
        <Textarea
          id="back"
          placeholder="Enter the back side of your flashcard"
          value={formData.back}
          onChange={(e) => handleInputChange("back", e.target.value)}
          className={formErrors.back ? "border-destructive" : ""}
          aria-invalid={!!formErrors.back}
          aria-describedby={formErrors.back ? "back-error" : undefined}
          required
        />
        {formErrors.back && (
          <p id="back-error" className="text-sm text-destructive">
            {formErrors.back}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phonetic" className="flex justify-between">
          <span>Phonetic (optional)</span>
          {formData.phonetic && (
            <span className="text-xs text-muted-foreground">
              {formData.phonetic.length}/{MAX_PHONETIC_LENGTH}
            </span>
          )}
        </Label>
        <Input
          id="phonetic"
          placeholder="Enter phonetic transcription"
          value={formData.phonetic || ""}
          onChange={(e) => handleInputChange("phonetic", e.target.value || null)}
          className={formErrors.phonetic ? "border-destructive" : ""}
          aria-invalid={!!formErrors.phonetic}
          aria-describedby={formErrors.phonetic ? "phonetic-error" : undefined}
        />
        {formErrors.phonetic && (
          <p id="phonetic-error" className="text-sm text-destructive">
            {formErrors.phonetic}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags" className="flex justify-between">
          <span>Tags (comma separated, max {MAX_TAGS})</span>
          <span className="text-xs text-muted-foreground">
            {formData.tags.length}/{MAX_TAGS}
          </span>
        </Label>
        <Input
          id="tags"
          placeholder="Enter tags, separated by commas"
          value={tagInput}
          onChange={(e) => handleTagsChange(e.target.value)}
          className={formErrors.tags ? "border-destructive" : ""}
          aria-invalid={!!formErrors.tags}
          aria-describedby={formErrors.tags ? "tags-error" : undefined}
        />
        {formErrors.tags && (
          <p id="tags-error" className="text-sm text-destructive">
            {formErrors.tags}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Each tag must be less than {MAX_TAG_LENGTH} characters. Use commas (,) to separate tags.
        </p>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Creating..." : "Create Flashcard"}
      </Button>
    </form>
  );
}
