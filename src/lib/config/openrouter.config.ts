import { z } from "zod";
import type { OpenRouterConfig } from "../services/openrouter.service";

const envSchema = z.object({
  OPENROUTER_API_KEY: z.string().min(1),
  OPENROUTER_API_ENDPOINT: z.string().url().default("https://openrouter.ai/api/v1/chat/completions"),
  OPENROUTER_MODEL: z.string().default("anthropic/claude-3-sonnet"),
  APP_NAME: z.string().default("Smart 10x Cards"),
});

// Validate environment variables
const env = envSchema.parse({
  OPENROUTER_API_KEY: import.meta.env.OPENROUTER_API_KEY,
  OPENROUTER_API_ENDPOINT: import.meta.env.OPENROUTER_API_ENDPOINT,
  OPENROUTER_MODEL: import.meta.env.OPENROUTER_MODEL,
  APP_NAME: import.meta.env.APP_NAME,
});

export const openRouterConfig: OpenRouterConfig = {
  apiKey: env.OPENROUTER_API_KEY,
  apiEndpoint: env.OPENROUTER_API_ENDPOINT,
  defaultModelName: env.OPENROUTER_MODEL,
  modelParameters: {
    maxTokens: 2000,
    temperature: 0.7,
  },
  applicationParameters: {
    applicationTitle: env.APP_NAME,
  },
};
