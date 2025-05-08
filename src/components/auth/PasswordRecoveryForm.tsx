import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface PasswordRecoveryFormProps {
  onSubmit: (email: string) => Promise<void>;
}

export function PasswordRecoveryForm({ onSubmit }: PasswordRecoveryFormProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Proszę podać adres email");
      return;
    }

    try {
      setIsLoading(true);
      await onSubmit(email);
      setIsSuccess(true);
      toast.success(`Jeśli konto o adresie ${email} istnieje, otrzymasz instrukcje resetowania hasła.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Wystąpił nieoczekiwany błąd");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-4 text-center">
        <div className="text-sm">
          <a href="/auth/login" className="text-primary hover:underline">
            Powrót do logowania
          </a>
        </div>
      </div>
    );
  }

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
      </div>

      <div className="space-y-4">
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Wysyłanie instrukcji..." : "Wyślij instrukcje resetowania"}
        </Button>

        <div className="text-center text-sm">
          Pamiętasz hasło?{" "}
          <a href="/auth/login" className="text-primary hover:underline">
            Zaloguj się
          </a>
        </div>
      </div>
    </form>
  );
}
