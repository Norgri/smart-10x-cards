import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { toast } from "sonner";

interface SearchBarProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export function SearchBar({ selectedTags, onTagsChange }: SearchBarProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      const newTag = inputValue.trim();

      if (selectedTags.length >= 4) {
        toast.error("Maximum 4 tags are allowed");
        return;
      }

      if (!selectedTags.includes(newTag)) {
        const newTags = [...selectedTags, newTag];
        onTagsChange(newTags);
        setInputValue("");
      } else {
        toast.error("This tag is already selected");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = selectedTags.filter((tag) => tag !== tagToRemove);
    onTagsChange(newTags);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="tag-search">Search by Tags</Label>
        <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-2 border rounded-md">
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1 px-3 py-1">
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="ml-1 hover:text-destructive focus:outline-none"
                aria-label={`Remove ${tag} tag`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>
      <Input
        id="tag-search"
        type="text"
        placeholder="Type a tag and press Enter to filter flashcards..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full"
        aria-label="Add tag"
        aria-describedby="tag-search-hint"
      />
      <p id="tag-search-hint" className="text-sm text-muted-foreground">
        Press Enter to add a tag. Maximum 4 tags allowed.
      </p>
    </div>
  );
}
