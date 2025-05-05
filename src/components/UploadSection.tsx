import { useCallback, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { toast } from "sonner";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png"] as const;

interface UploadSectionProps {
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
  onGenerate: () => void;
  disabled?: boolean;
}

export function UploadSection({ selectedFile, onFileSelect, onGenerate, disabled }: UploadSectionProps) {
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = useCallback((file: File | null): { isValid: boolean; error?: string } => {
    if (!file) return { isValid: false };

    if (!ALLOWED_FILE_TYPES.includes(file.type as (typeof ALLOWED_FILE_TYPES)[number])) {
      return {
        isValid: false,
        error: "Invalid file type. Please select a JPEG or PNG image.",
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: "File is too large. Maximum size is 10MB.",
      };
    }

    return { isValid: true };
  }, []);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] || null;
      const validation = validateFile(file);

      if (!validation.isValid) {
        if (validation.error) {
          toast.error(validation.error);
        }
        onFileSelect(null);
        event.target.value = "";
        return;
      }

      onFileSelect(file);
      if (file) {
        toast.success(`File "${file.name}" selected successfully`);
      }
    },
    [onFileSelect, validateFile]
  );

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);

      const file = event.dataTransfer.files?.[0] || null;
      const validation = validateFile(file);

      if (!validation.isValid) {
        if (validation.error) {
          toast.error(validation.error);
        }
        return;
      }

      onFileSelect(file);
      if (file) {
        toast.success(`File "${file.name}" selected successfully`);
      }
    },
    [onFileSelect, validateFile]
  );

  return (
    <Card>
      <CardContent className="pt-6">
        <div
          className={`space-y-4 ${isDragging ? "bg-muted/50" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="region"
          aria-label="File upload section"
        >
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                type="file"
                accept={ALLOWED_FILE_TYPES.join(",")}
                onChange={handleFileChange}
                disabled={disabled}
                className="flex-1"
                aria-label="Choose image file"
                aria-describedby="file-description"
                data-testid="file-input"
              />
              <p id="file-description" className="text-xs text-muted-foreground mt-1">
                Accepted formats: JPEG, PNG. Maximum size: 10MB
              </p>
            </div>
            <Button
              onClick={onGenerate}
              disabled={!selectedFile || disabled}
              aria-label="Generate flashcards"
              data-testid="generate-button"
            >
              Generate
            </Button>
          </div>
          {selectedFile && (
            <p className="text-sm text-muted-foreground" role="status">
              Selected file: {selectedFile.name}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
