# API Endpoint Implementation Plan: Log Generated Flashcard Action

## 1. Przegląd punktu końcowego
This endpoint logs user actions on a generated flashcard within an AI generation session. For actions of type "accepted" or "edited", the system automatically creates a new flashcard record. All logged actions are stored in the `log_action` table for analytical and auditing purposes.

## 2. Szczegóły żądania
- **Metoda HTTP:** POST
- **Struktura URL:** `/api/generation-sessions/{session_id}/flashcard-actions`
- **Parametry URL:**
  - `session_id` (wymagany): Identifier of the generation session.
- **Request Body:**
  ```json
  {
    "actionType": "accepted", // Must be one of "accepted", "edited", or "rejected"
    "generatedFlashcard": {
      "front": "Generated front text",  // Non-empty string is required for accepted/edited actions
      "back": "Generated back text",    // Non-empty string is required for accepted/edited actions
      "phonetic": "Optional phonetic",  // Optional string or null
      "tags": ["tag1", "tag2"],         // Array of up to 4 tag strings
      "source": "ai"                    // Fixed value "ai"
    }
  }
  ```
- **Autoryzacja:**
  - Wymagany ważny token JWT w ciasteczkach sesji Supabase
  - Endpoint zwraca 401 Unauthorized jeśli brak ważnej sesji
  - Identyfikator użytkownika jest automatycznie pobierany z kontekstu sesji

## 3. Wykorzystywane typy
- **DTOs i Command Modele:**
  - `LogFlashcardActionCommand`: Reprezentuje dane wejściowe przesyłane do endpointu.
  - `LogActionDTO`: Reprezentuje schemat odpowiedzi zwracanej przez endpoint.
  - (Opcjonalnie) `CreateFlashcardCommand` lub `UpdateFlashcardCommand` mogą być użyte wewnętrznie podczas tworzenia rekordu fiszki.

## 4. Szczegóły odpowiedzi
- **Struktura odpowiedzi:**
  ```json
  {
    "id": 456,
    "sessionId": "session-123",
    "flashcardId": 789,            // Obecne, jeśli akcja to "accepted" lub "edited"
    "actionType": "accepted",
    "timestamp": "2023-10-01T12:05:00Z"
  }
  ```
- **Kody statusu:**
  - `201 Created`: Udane logowanie (oraz utworzenie fiszki, jeśli dotyczy).
  - `400 Bad Request`: Nieprawidłowe dane wejściowe, np. błędny typ akcji czy niewłaściwe dane fiszki.
  - `404 Not Found`: Sesja generowania nie została odnaleziona.
  - `500 Internal Server Error`: Błąd po stronie serwera.

## 5. Przepływ danych
1. Ekstrakcja i walidacja `session_id` z URL.
2. Parsowanie i walidacja danych wejściowych za pomocą Zod, zgodnie z modelem `LogFlashcardActionCommand`.
3. Weryfikacja istnienia sesji generowania w bazie danych.
4. W przypadku akcji "accepted" lub "edited":
   - Walidacja danych fiszki (pola `front` i `back` muszą być niepuste, maksymalnie 4 tagi).
   - Utworzenie nowego rekordu w tabeli `flashcards` oraz uzyskanie automatycznie wygenerowanego `id`.
5. Wstawienie nowego rekordu do tabeli `log_action` z następującymi danymi:
   - `generation_session_id`: pobrany z URL.
   - `flashcard_id`: odniesienie do utworzonej fiszki (jeśli dotyczy).
   - `action_type`: wartość przekazana w żądaniu.
6. Zwrot pełnego rekordu logu jako odpowiedzi.

## 6. Względy bezpieczeństwa
- **Autoryzacja:**
  - Endpoint dostępny tylko dla uwierzytelnionych użytkowników poprzez middleware
  - Identyfikator użytkownika pobierany automatycznie z kontekstu sesji
  - Walidacja czy sesja generowania należy do zalogowanego użytkownika
- **Dostęp:**
  - Weryfikacja, czy sesja generowania należy do użytkownika lub jest do niego dostępna.
- **Walidacja Danych:**
  - Użycie solidnych mechanizmów walidacyjnych (np. Zod) do sanityzacji i potwierdzenia danych wejściowych.
- **Bezpieczeństwo Bazy Danych:**
  - Korzystanie z zapytań parametryzowanych w celu zapobiegania SQL Injection.
- **Transakcje:**
  - Użycie transakcji w bazie danych dla zapewnienia spójności przy jednoczesnym tworzeniu fiszki i logowaniu akcji.

## 7. Obsługa błędów
- **401 Unauthorized:**
  - Zwracany automatycznie przez middleware dla nieautoryzowanych żądań
  - Przekierowanie na stronę logowania
- **400 Bad Request:**
  - Błędny `actionType` lub brak wymaganych pól.
  - Przekroczenie limitu 4 tagów.
- **404 Not Found:**
  - Sesja generowania nie została odnaleziona.
- **500 Internal Server Error:**
  - Nieoczekiwane błędy, np. problemy z połączeniem z bazą danych.

Wszystkie błędy powinny być logowane dla celów diagnostycznych.

## 8. Rozważania dotyczące wydajności
- **Transakcje:** Użycie transakcji, aby zapewnić atomowość operacji (tworzenie fiszki i logowanie akcji).
- **Indeksacja:** Upewnienie się, że tabele `log_action`, `flashcards` oraz `generation_session` są właściwie zindeksowane.
- **Asynchroniczność:** Rozważenie asynchronicznego przetwarzania operacji, jeśli to możliwe, by zminimalizować opóźnienia.
- **Skalowalność:** Optymalizacja walidacji oraz logowania błędów, aby nie wpływały negatywnie na wydajność przy większym obciążeniu.

## 9. Etapy wdrożenia
1. **Service Layer:**
   - Aktualizacja serwisu `GenerationService`:
     - Weryfikuje czy dana sesja istnieje.
   - Utworzenie lub aktualizacja serwisu (np. `FlashcardActionService`), który:
     - Używa `GenerationService` do weryfikacji czy dana sesja istnieje
     - Tworzy rekord fiszki w przypadku akcji "accepted" lub "edited".
     - Loguje akcję w tabeli `log_action`.
2. **Walidacja:**
   - Implementacja walidacji wejścia przy użyciu Zod na poziomie endpointa nie Service Layer.
   - Egzekwowanie reguł biznesowych (pola niepuste, maksymalna liczba tagów).
3. **API Route:**
   - Utworzenie pliku endpointu w `src/pages/api/generation-sessions/[session_id]/flashcard-actions.ts`.
   - Podpięcie routingu i integracja z warstwą serwisową.
   - Walidacja danych wejściowych.
4. **Interakcja z Bazą Danych:**
   - Wdrożenie operacji na bazie danych za pomocą klienta Supabase.
   - Użycie transakcji do połączenia operacji tworzenia fiszki (jeśli dotyczy) i logowania akcji.
5. **Obsługa Błędów:**
   - Implementacja mechanizmów obsługi błędów wewnątrz endpointu lub poprzez middleware.
   - Mapowanie błędów do odpowiednich kodów HTTP.
6. **Bezpieczeństwo i Testowanie:**
   - Zapewnienie, że endpoint jest zabezpieczony przez odpowiednie mechanizmy autoryzacji.
   - Napisanie testów jednostkowych i integracyjnych dla różnych scenariuszy (sukces, walidacja, błędy serwera).
7. **Dokumentacja:**
   - Aktualizacja dokumentacji API z pełnymi szczegółami oraz przykładami.
8. **Monitoring:**
   - Konfiguracja logowania i monitorowania wydajności oraz błędów po wdrożeniu endpointu. 