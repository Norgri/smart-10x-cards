import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const LOGIN_TIMEOUT = 10000; // 10 seconds

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Proszę wypełnić wszystkie pola");
      return;
    }

    try {
      setIsLoading(true);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), LOGIN_TIMEOUT);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Wystąpił błąd podczas logowania");
      }

      window.location.href = data.redirectTo;
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === "AbortError") {
          toast.error("Przekroczono czas oczekiwania na odpowiedź serwera");
        } else {
          toast.error(err.message);
        }
      } else {
        toast.error("Wystąpił nieoczekiwany błąd");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Wprowadź adres email"
            autoComplete="email"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Hasło</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Wprowadź hasło"
            autoComplete="current-password"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-4">
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Logowanie..." : "Zaloguj się"}
        </Button>

        <div className="text-center text-sm">
          <a href="/auth/forgot-password" className="text-primary hover:underline">
            Zapomniałeś hasła?
          </a>
        </div>

        <div className="text-center text-sm">
          Nie masz jeszcze konta?{" "}
          <a href="/auth/register" className="text-primary hover:underline">
            Zarejestruj się
          </a>
        </div>
      </div>
    </form>
  );
}
