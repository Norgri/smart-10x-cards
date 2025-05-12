# Specyfikacja modułu autentykacji i odzyskiwania hasła

## 1. Architektura interfejsu użytkownika

### 1.1 Warstwa Frontendu (Astro oraz React)
- Utworzymy dedykowane layouty:
  - `AuthLayout.astro` do stron związanych z autoryzacją (logowanie, rejestracja, odzyskiwanie hasła)
  - `Layout.astro` dla pozostałych stron aplikacji (non-auth)
- Strony związane z autentykacją umieścimy w katalogu `/src/pages/auth/`:
  - `login.astro` – strona logowania (US-002)
  - `register.astro` – strona rejestracji
  - `forgot-password.astro` – strona odzyskiwania hasła
- Dynamiczne komponenty React (z wykorzystaniem Shadcn/ui) zostaną umieszczone w katalogu `/src/components/ui/auth/`:
  - `LoginForm.tsx` – formularz logowania
  - `RegisterForm.tsx` – formularz rejestracji
  - `PasswordRecoveryForm.tsx` – formularz odzyskiwania hasła

### 1.2 Rozdzielenie odpowiedzialności
- Strony Astro zajmą się routingiem, renderowaniem server-side oraz integracją z backendem autentykacji.
- Komponenty React (client-side) będą odpowiedzialne za interakcję z użytkownikiem, walidację formularzy oraz prezentację komunikatów błędów.
- Formularze będą korzystać z dedykowanego modułu serwisowego (np. `/src/lib/auth.ts`), który komunikuje się bezpośrednio z Supabase Auth lub wywołuje odpowiednie endpointy API.

### 1.3 Walidacja i komunikaty błędów
- **Klient:**
  - Walidacja pola email (format, wymagane) oraz hasła (minimalna długość, potwierdzenie hasła w rejestracji).
  - Natychmiastowe wyświetlanie komunikatów błędów (np. 'Invalid email or password', 'Email already in use').
- **Serwer:**
  - Dodatkowa walidacja danych wejściowych przy użyciu schematów (np. Zod lub TypeScript) w endpointach API.
  - Obsługa wyjątków, np. błąd połączenia z Supabase, już istniejący email czy nieznaleziony użytkownik przy odzyskiwaniu hasła.

### 1.4 Najważniejsze scenariusze
- **Logowanie (US-002):**
  - Użytkownik wprowadza email i hasło, formularz wysyła dane do endpointu logowania lub bezpośrednio wykorzystuje metodę `signInWithPassword` Supabase.
  - Po poprawnej autentykacji następuje przekierowanie do panelu użytkownika.
  - W przypadku błędnych danych wyświetlany jest komunikat o błędzie.
- **Rejestracja (US-001):**
  - Formularz rejestracji zawiera pola: email, hasło oraz potwierdzenie hasła.
  - Walidacja adresu email odbywa się po stronie klienta (np. przy użyciu walidacji HTML/JavaScript) oraz serwera (np. przy użyciu Zod lub TypeScript).
  - Hasło musi spełniać określone wymagania dotyczące minimalnej długości oraz złożoności.
  - System sprawdza, czy wprowadzony email jest unikalny przed utworzeniem konta poprzez metodę `signUp` Supabase.
  - Hasła są bezpiecznie hashowane przed zapisem w bazie danych.
  - Po pomyślnej rejestracji użytkownik otrzymuje potwierdzenie (np. komunikat lub email weryfikacyjny) oraz możliwość przejścia do logowania.
  - W przypadku błędów (np. email już w użyciu, niepoprawne dane) wyświetlany jest zrozumiały komunikat.
- **Odzyskiwanie hasła:**
  - Użytkownik wpisuje przypisany do konta adres email.
  - System inicjuje proces resetu hasła, wykorzystując metodę resetu hasła (np. `resetPasswordForEmail` Supabase), a użytkownik otrzymuje maila z instrukcjami.
  - *Uwaga: Funkcjonalność odzyskiwania hasła stanowi rozszerzenie standardowego procesu autentykacji, zapewniając pełny cykl użytkownika, mimo że nie została explicite określona w PRD.*

## 2. Logika backendowa

### 2.1 Struktura endpointów API
- Endpointy będą zlokalizowane w katalogu `/src/pages/api/auth/` i obejmą:
  - `signup.ts` – obsługa rejestracji użytkownika
  - `login.ts` – obsługa logowania
  - `reset-password.ts` – inicjacja procesu odzyskania hasła
- Każdy endpoint przyjmuje dane w formacie JSON, waliduje dane wejściowe (przy użyciu schematów walidacyjnych) oraz komunikuje się z Supabase Auth.

### 2.2 Mechanizm walidacji danych wejściowych
- Implementacja walidacji przy użyciu bibliotek takich jak Zod lub typów TypeScript.
- Każdy endpoint waliduje otrzymane dane i zwraca odpowiednie kody statusu HTTP w przypadku błędów (np. 400 Bad Request, 401 Unauthorized).
- Wszelkie wyjątki (np. problem z bazą, błędy Supabase) są logowane oraz odpowiednio przekazywane do klienta.

### 2.3 Aktualizacja renderowania stron server-side
- Wykorzystanie middleware (`/src/middleware/index.ts`) do weryfikacji sesji użytkownika przed renderowaniem stron wymagających autoryzacji.
- Konfiguracja w `astro.config.mjs` zapewnia integrację z mechanizmem autentykacji, umożliwiając kontrolę dostępu do stron server-side.

## 3. System autentykacji

### 3.1 Wykorzystanie Supabase Auth
- Cały system autentykacji oparty jest o Supabase Auth:
  - `signUp` – metoda rejestracji użytkownika
  - `signInWithPassword` – metoda logowania
  - `resetPasswordForEmail` (lub analogiczna metoda) – proces odzyskiwania hasła
  - `signOut` – metoda wylogowywania
- Supabase Auth zapewnia bezpieczne zarządzanie sesjami oraz przechowywanie tokenów, które mogą być synchronizowane między serwerem a klientem.

### 3.2 Integracja z Astro i frontendem
- Utworzymy moduł serwisowy, np. `AuthService` w `/src/lib/auth.ts`, który abstrahuje interakcje z Supabase.
- Moduł ten będzie implementował kontrakty między komponentami React a backendem, umożliwiając:
  - Rejestrację
  - Logowanie
  - Wylogowywanie
  - Odzyskiwanie hasła
- Stan autentykacji będzie przechowywany w bezpiecznych ciasteczkach lub poprzez mechanizmy oferowane przez Supabase.

### 3.3 Kontrakty i typy
- W pliku `/src/types.ts` zdefiniujemy:
  - Interfejs `User` reprezentujący użytkownika (id, email, created_at, itd.)
  - Interfejs `AuthResponse` dla odpowiedzi z operacji autentykacyjnych
- Serwis `AuthService` wykorzysta te kontrakty do przekazywania danych pomiędzy frontendem a backendem.

## Podsumowanie
Specyfikacja modułu autentykacji i odzyskiwania hasła została zaprojektowana z myślą o integralności całej aplikacji, włączając funkcjonalność generowania fiszek (US-003 i US-004). Rozwiązanie zapewnia spójność interfejsu użytkownika poprzez przejrzysty podział na strony Astro i dynamiczne komponenty React, a także solidną logikę backendową opartą o Supabase Auth. Podejście to gwarantuje bezpieczeństwo, skalowalność oraz łatwą integrację z istniejącą architekturą systemu. 