import { useCallback, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { toast } from "sonner";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/jpg"] as const;

interface UploadSectionProps {
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
  onGenerate: () => void;
  disabled?: boolean;
}

export function UploadSection({ selectedFile, onFileSelect, onGenerate, disabled }: UploadSectionProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

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

  const handleDragEnter = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setDragCounter((prev) => prev + 1);
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setDragCounter((prev) => prev - 1);
      if (dragCounter <= 1) {
        setIsDragging(false);
        setDragCounter(0);
      }
    },
    [dragCounter]
  );

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);
      setDragCounter(0);

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
          onDragEnter={handleDragEnter}
          onDragOver={handleDragEnter}
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
                aria-describedby="file-description file-status"
                data-testid="file-input"
              />
              <p id="file-description" className="text-xs text-muted-foreground mt-1">
                Accepted formats: JPEG, PNG. Maximum size: 10MB
              </p>
            </div>
            <Button
              onClick={onGenerate}
              disabled={!selectedFile || disabled}
              aria-label={disabled ? "Generating flashcards..." : "Generate flashcards"}
              aria-busy={disabled}
              data-testid="generate-button"
            >
              Generate
            </Button>
          </div>
          {selectedFile && (
            <p id="file-status" className="text-sm text-muted-foreground" role="status" aria-live="polite">
              Selected file: {selectedFile.name}
            </p>
          )}
          {isDragging && (
            <div
              className="absolute inset-0 border-2 border-dashed border-primary rounded-lg bg-primary/5 pointer-events-none"
              role="presentation"
              aria-hidden="true"
            >
              <div className="flex items-center justify-center h-full">
                <p className="text-primary">Drop your image here</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
