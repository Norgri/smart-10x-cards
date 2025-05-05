import { z } from "zod";

// Types and interfaces
export interface OpenRouterConfig {
  apiEndpoint: string;
  apiKey: string;
  defaultModelName: string;
  modelParameters: {
    maxTokens: number;
    temperature: number;
    [key: string]: unknown;
  };
  applicationParameters?: {
    httpReferer?: string;
    applicationTitle?: string;
  };
}

export type MessageContentPart =
  | {
      type: "text";
      text: string;
    }
  | {
      type: "image_url";
      image_url: {
        url: string;
      };
    };

export interface Message {
  role: "user" | "assistant" | "system";
  content: MessageContentPart[] | string;
}

export interface OpenRouterResponse {
  id: string;
  choices: {
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
  }[];
}

// Validation schemas
const openRouterConfigSchema = z.object({
  apiEndpoint: z.string().url(),
  apiKey: z.string().min(1),
  defaultModelName: z.string().min(1),
  modelParameters: z
    .object({
      maxTokens: z.number().int().positive(),
      temperature: z.number().min(0).max(1),
    })
    .passthrough(),
  applicationParameters: z
    .object({
      httpReferer: z.string().url().optional(),
      applicationTitle: z.string().min(1).optional(),
    })
    .optional(),
}) satisfies z.ZodType<OpenRouterConfig>;

const messageContentPartSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("text"),
    text: z.string(),
  }),
  z.object({
    type: z.literal("image_url"),
    image_url: z.object({
      url: z.string().url(),
    }),
  }),
]);

const messageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.union([z.string(), z.array(messageContentPartSchema)]),
});

const openRouterResponseSchema = z.object({
  id: z.string(),
  choices: z.array(
    z.object({
      message: z.object({
        content: z.string(),
        role: z.string(),
      }),
      finish_reason: z.string(),
    })
  ),
}) satisfies z.ZodType<OpenRouterResponse>;

// Custom error types
export class OpenRouterError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly retryable = false
  ) {
    super(message);
    this.name = "OpenRouterError";
  }
}

export class OpenRouterApiError extends OpenRouterError {
  constructor(message: string, statusCode: number) {
    super(message, statusCode, statusCode >= 500 || statusCode === 429);
    this.name = "OpenRouterApiError";
  }
}

export class OpenRouterService {
  private readonly config: OpenRouterConfig;
  private readonly headers: Record<string, string>;
  private retryCount = 3;
  private retryDelay = 1000;

  constructor(config: OpenRouterConfig) {
    const validatedConfig = openRouterConfigSchema.parse(config);
    this.config = validatedConfig;

    this.headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.config.apiKey}`,
    };

    if (this.config.applicationParameters?.httpReferer) {
      this.headers["HTTP-Referer"] = this.config.applicationParameters.httpReferer;
    }
    if (this.config.applicationParameters?.applicationTitle) {
      this.headers["X-Title"] = this.config.applicationParameters.applicationTitle;
    }
  }

  private logError(error: Error): void {
    // Remove sensitive data from error message
    const sanitizedError = this.sanitizeErrorMessage(error.message);
    console.error(`[OpenRouter Service Error]: ${sanitizedError}`);
  }

  private sanitizeErrorMessage(message: string): string {
    // Remove API key if present in the message
    return message.replace(new RegExp(this.config.apiKey, "g"), "[REDACTED]");
  }

  /**
   * Sends a request to the OpenRouter API
   * @param messages Array of messages to send. Each message can contain text or image content.
   * Example:
   * ```typescript
   * const messages = [
   *   // System message for setting context
   *   {
   *     role: "system",
   *     content: "You are a helpful assistant that provides concise answers."
   *   },
   *   // User message with text and image
   *   {
   *     role: "user",
   *     content: [
   *       {
   *         type: "text",
   *         text: "What's in this image?"
   *       },
   *       {
   *         type: "image_url",
   *         image_url: {
   *           url: "https://example.com/image.jpg"
   *         }
   *       }
   *     ]
   *   }
   * ]
   * ```
   * @param responseFormat Optional format specification for structured outputs
   * Example:
   * ```typescript
   * const format = {
   *   type: "json_object",
   *   schema: {
   *     type: "object",
   *     properties: {
   *       summary: { type: "string" },
   *       keywords: { type: "array", items: { type: "string" } }
   *     }
   *   }
   * }
   * ```
   * @param additionalParams Optional parameters to override default model parameters
   * @returns Promise resolving to the API response
   */
  public async sendRequest(
    messages: Message[],
    responseFormat?: { type: "json_object" | "json_schema"; schema?: Record<string, unknown> },
    additionalParams?: Partial<OpenRouterConfig["modelParameters"]>
  ): Promise<OpenRouterResponse> {
    let lastError: Error | null = null;
    let attempt = 0;

    while (attempt < this.retryCount) {
      try {
        const payload = this.buildPayload(messages, responseFormat, additionalParams);
        const response = await fetch(this.config.apiEndpoint, {
          method: "POST",
          headers: this.headers,
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw await this.handleApiError(response);
        }

        const data = await response.json();
        return this.validateResponse(data);
      } catch (error) {
        lastError = error as Error;

        if (error instanceof OpenRouterError && !error.retryable) {
          throw error;
        }

        if (attempt < this.retryCount - 1) {
          const delay = this.calculateRetryDelay(attempt);
          await this.sleep(delay);
          attempt++;
          continue;
        }

        this.logError(lastError);
        throw new OpenRouterError(
          `Failed to send request after ${this.retryCount} attempts: ${lastError.message}`,
          undefined,
          false
        );
      }
    }

    throw lastError || new Error("Unexpected error in retry loop");
  }

  private async handleApiError(response: Response): Promise<never> {
    const statusCode = response.status;
    let errorMessage: string;

    switch (statusCode) {
      case 401:
        errorMessage = "Invalid API key";
        break;
      case 403:
        errorMessage = "Access forbidden";
        break;
      case 429:
        errorMessage = "Rate limit exceeded";
        break;
      case 500:
        errorMessage = "OpenRouter internal server error";
        break;
      default:
        errorMessage = `OpenRouter API error: ${response.statusText}`;
    }

    const responseBody = await response.text().catch(() => "");
    if (responseBody) {
      errorMessage += ` - ${responseBody}`;
    }

    throw new OpenRouterApiError(errorMessage, statusCode);
  }

  private calculateRetryDelay(attempt: number): number {
    // Exponential backoff with jitter
    const baseDelay = this.retryDelay;
    const maxDelay = baseDelay * Math.pow(2, this.retryCount - 1);
    const exponentialDelay = baseDelay * Math.pow(2, attempt);
    const jitter = Math.random() * 0.1 * exponentialDelay;
    return Math.min(exponentialDelay + jitter, maxDelay);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private buildPayload(
    messages: Message[],
    responseFormat?: { type: "json_object" | "json_schema"; schema?: Record<string, unknown> },
    additionalParams?: Partial<OpenRouterConfig["modelParameters"]>
  ): Record<string, unknown> {
    // Validate messages
    const validatedMessages = messages.map((msg) => messageSchema.parse(msg));

    // Validate and normalize parameters
    const parameters = this.normalizeModelParameters({
      ...this.config.modelParameters,
      ...additionalParams,
    });

    const payload: Record<string, unknown> = {
      model: this.config.defaultModelName,
      messages: validatedMessages,
      ...parameters,
    };

    // Add response format if specified
    if (responseFormat) {
      payload.response_format = responseFormat;
    }

    return payload;
  }

  private normalizeModelParameters(params: Partial<OpenRouterConfig["modelParameters"]>): Record<string, unknown> {
    const normalized = { ...params };

    // Ensure maxTokens is within reasonable limits
    if (normalized.maxTokens !== undefined) {
      normalized.maxTokens = Math.min(Math.max(1, normalized.maxTokens), 4096);
    }

    // Ensure temperature is within valid range
    if (normalized.temperature !== undefined) {
      normalized.temperature = Math.min(Math.max(0, normalized.temperature), 1);
    }

    return normalized;
  }

  private validateResponse(response: unknown): OpenRouterResponse {
    try {
      return openRouterResponseSchema.parse(response);
    } catch (error) {
      this.logError(error as Error);
      throw new Error("Invalid response format from OpenRouter API");
    }
  }
}
