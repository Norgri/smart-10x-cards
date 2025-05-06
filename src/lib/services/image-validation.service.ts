interface ImageValidationResult {
  isValid: boolean;
  error?: string;
}

interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  size: number;
}

export class ImageValidationService {
  private static readonly MAX_SIZE_MB = 10;
  private static readonly MAX_DIMENSION = 4096;
  private static readonly MIN_DIMENSION = 100;
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

      // Check dimensions
      const metadata = await this.getImageMetadata(file);

      if (
        metadata.width > ImageValidationService.MAX_DIMENSION ||
        metadata.height > ImageValidationService.MAX_DIMENSION
      ) {
        return {
          isValid: false,
          error: `Image dimensions must not exceed ${ImageValidationService.MAX_DIMENSION}x${ImageValidationService.MAX_DIMENSION}`,
        };
      }

      if (
        metadata.width < ImageValidationService.MIN_DIMENSION ||
        metadata.height < ImageValidationService.MIN_DIMENSION
      ) {
        return {
          isValid: false,
          error: `Image dimensions must be at least ${ImageValidationService.MIN_DIMENSION}x${ImageValidationService.MIN_DIMENSION}`,
        };
      }

      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        error: "Failed to validate image: " + (error instanceof Error ? error.message : "Unknown error"),
      };
    }
  }

  private getImageMetadata(file: File): Promise<ImageMetadata> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
          format: file.type,
          size: file.size,
        });
      };
      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };
      img.src = URL.createObjectURL(file);
    });
  }
}
