/// <reference types="astro/client" />

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./db/database.types";

declare global {
  namespace App {
    // For protected routes, user will always be defined (guaranteed by middleware)
    interface Locals {
      supabase: SupabaseClient<Database>;
      user: {
        email?: string;
        id: string;
      };
    }
  }

  // Add global handleNavbarLogout function to Window interface
  interface Window {
    handleNavbarLogout: () => Promise<void>;
  }
}

interface ImportMetaEnv {
  readonly SUPABASE_URL: string;
  readonly SUPABASE_KEY: string;
  readonly OPENROUTER_API_KEY: string;
  readonly E2E_USERNAME_ID: string;
  readonly E2E_USERNAME: string;
  readonly E2E_PASSWORD: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
