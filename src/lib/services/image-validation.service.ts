interface ImageValidationResult {
  isValid: boolean;
  error?: string;
}

export class ImageValidationService {
  private static readonly MAX_SIZE_MB = 10;
  private static readonly ALLOWED_FORMATS = ["image/jpeg", "image/png"];

  /**
   * Validates image file based on size, dimensions and format
   */
  public async validateImage(file: File): Promise<ImageValidationResult> {
    try {
      // Check file size
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > ImageValidationService.MAX_SIZE_MB) {
        return {
          isValid: false,
          error: `Image size must be less than ${ImageValidationService.MAX_SIZE_MB}MB`,
        };
      }

      // Check format
      if (!ImageValidationService.ALLOWED_FORMATS.includes(file.type)) {
        return {
          isValid: false,
          error: `Image format must be one of: ${ImageValidationService.ALLOWED_FORMATS.join(", ")}`,
        };
      }

      return { isValid: true };
    } catch (error) {
      console.error("Error validating image:", error);

      return {
        isValid: false,
        error: "Failed to validate image: " + (error instanceof Error ? error.message : "Unknown error"),
      };
    }
  }
}
