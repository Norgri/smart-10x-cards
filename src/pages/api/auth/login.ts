import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "../../../db/supabase.client";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { email, password } = await request.json();

    const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return new Response(
        JSON.stringify({
          error: "Nieprawidłowy email lub hasło",
        }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({
        user: data.user,
        redirectTo: "/generate",
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Login error:", err);
    return new Response(
      JSON.stringify({
        error: "Wystąpił błąd podczas logowania",
      }),
      { status: 500 }
    );
  }
};
