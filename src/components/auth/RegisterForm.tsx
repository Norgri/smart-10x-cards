import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface RegisterFormProps {
  onSubmit: (email: string, password: string, confirmPassword: string) => Promise<void>;
}

export function RegisterForm({ onSubmit }: RegisterFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (pass: string) => {
    if (pass.length < 8) {
      return "Hasło musi mieć co najmniej 8 znaków";
    }
    if (!/[A-Z]/.test(pass)) {
      return "Hasło musi zawierać co najmniej jedną wielką literę";
    }
    if (!/[a-z]/.test(pass)) {
      return "Hasło musi zawierać co najmniej jedną małą literę";
    }
    if (!/[0-9]/.test(pass)) {
      return "Hasło musi zawierać co najmniej jedną cyfrę";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      toast.error("Proszę wypełnić wszystkie pola");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Hasła nie są identyczne");
      return;
    }

    try {
      setIsLoading(true);
      await onSubmit(email, password, confirmPassword);
      toast.success("Konto zostało utworzone pomyślnie");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Wystąpił nieoczekiwany błąd");
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
            autoComplete="new-password"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Powtórz hasło</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Potwierdź hasło"
            autoComplete="new-password"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-4">
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Tworzenie konta..." : "Utwórz konto"}
        </Button>

        <div className="text-center text-sm">
          Masz już konto?{" "}
          <a href="/auth/login" className="text-primary hover:underline">
            Zaloguj się
          </a>
        </div>
      </div>
    </form>
  );
}
