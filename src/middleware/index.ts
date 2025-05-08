import { defineMiddleware } from "astro:middleware";
import { createSupabaseServerInstance } from "../db/supabase.client";

const PUBLIC_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/reset-password",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/reset-password",
];

export const onRequest = defineMiddleware(async ({ locals, cookies, url, request, redirect }, next) => {
  // Create Supabase instance for this request
  const supabase = createSupabaseServerInstance({
    cookies,
    headers: request.headers,
  });

  // Always attach supabase instance to locals
  locals.supabase = supabase;

  // Skip auth check for public paths
  if (PUBLIC_PATHS.includes(url.pathname)) {
    return next();
  }

  // Get user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // Attach user to locals if authenticated
    locals.user = {
      email: user.email,
      id: user.id,
    };
    return next();
  }

  // Redirect to login for protected routes
  return redirect("/auth/login");
});
