# API Endpoint Implementation Plan: Generate Flashcards from Image

## 1. Przegląd punktu końcowego
Ten endpoint inicjuje proces generacji fiszek za pomocą przesłania obrazu. Po otrzymaniu obrazu, system waliduje dane, wywołuje zewnętrzny serwis AI do przetworzenia obrazu oraz tworzy wpis sesji generacji w bazie danych. W odpowiedzi zwracane są wygenerowane fiszki oraz ewentualne błędy, co umożliwia klientowi dalsze ich przetwarzanie.

## 2. Szczegóły żądania
- **Metoda HTTP:** POST
- **Struktura URL:** /api/generation-sessions
- **Parametry:**
  - **Wymagane:**
    - `image`: Plik obrazu w formacie JPG lub PNG (multipart/form-data).
  - **Opcjonalne:**
    - Brak dodatkowych parametrów.
- **Request Body:** Multipart/form-data zawierający pole `image`.

## 3. Wykorzystywane typy
- `GenerateFlashcardsFromImageCommand` – zawiera pole `image: File`.
- `GenerationSessionDTO` – zawiera pola: `id`, `flashcards`, `errors`, `createdAt`.
- `GeneratedFlashcardDTO` – definiuje strukturę pojedynczej fiszki (pola: `front`, `back`, `phonetic`, `tags`, `source`).
- `GenerationErrorDTO` – zawiera informacje o błędach (pola: `id`, `errorCode`, `errorMessage`, `createdAt`).

## 4. Szczegóły odpowiedzi
- **Kod odpowiedzi:**
  - 201 – Sesja generacji została poprawnie utworzona.
- **Struktura odpowiedzi:**
  ```json
  {
    "id": "session-123",
    "flashcards": [
      {
        "front": "Generated front text",
        "back": "Generated back text",
        "phonetic": "Optional phonetic",
        "tags": ["tag1", "tag2"],
        "source": "ai"
      }
    ],
    "errors": [
      {
        "id": 123,
        "errorCode": "Error code of failed generation",
        "errorMessage": "Error message"
      }
    ],
    "createdAt": "2023-10-01T12:00:00Z"
  }
  ```
- **Możliwe kody błędów:**
  - 400 – Nieprawidłowy format pliku lub brak wymaganego pola.
  - 401 – Nieautoryzowany dostęp (brak lub nieważny token JWT).
  - 500 – Błąd przetwarzania przez serwis AI lub inne wewnętrzne błędy serwera.

## 5. Przepływ danych
1. Użytkownik wysyła żądanie POST z obrazem do endpointu `/api/generation-sessions`.
2. Middleware weryfikuje autoryzację żądania (sprawdza token JWT) i ustawia odpowiedni kontekst użytkownika.
3. Kontroler API wykonuje walidację wejściowych danych:
   - Sprawdza obecność pola `image`.
   - Waliduje format (JPG lub PNG) oraz rozmiar pliku.
4. Po pozytywnej walidacji, kontroler przekazuje plik do serwisu odpowiedzialnego za obsługę generacji fiszek.
5. Serwis:
   - Komunikuje się z zewnętrznym API AI w celu przetworzenia obrazu.
   - Odbiera wynik generacji, przetwarza dane i przygotowuje listę fiszek.
6. W przypadku wystąpienia błędów podczas generacji, serwis rejestruje je w tabeli `generation_error` i uwzględnia w odpowiedzi.
7. Tworzony jest wpis sesji generacji w tabeli `generation_session` wraz z powiązanymi rekordami fiszek.
8. Endpoint zwraca odpowiedź JSON zgodną z `GenerationSessionDTO`.

## 6. Względy bezpieczeństwa
- **Uwierzytelnianie i autoryzacja:**
  - Każde żądanie musi zawierać ważny token JWT w nagłówku `Authorization`.
  - Supabase RLS (Row-Level Security) ogranicza dostęp do danych tylko do właściciela zasobu.
- **Walidacja danych wejściowych:**
  - Weryfikacja obecności pola `image` oraz sprawdzenie jego formatu i rozmiaru, aby zapobiec atakom typu DOS.
- **Ochrona danych:**
  - Rejestrowanie wszystkich operacji w celu monitorowania i audytu.

## 7. Obsługa błędów
- **Błąd 400:**
  - Zwracany w przypadku braku pola `image`, niewłaściwego formatu lub przekroczenia limitu rozmiaru.
- **Błąd 401:**
  - Zwracany, gdy żądanie pochodzi od nieautoryzowanego użytkownika.
- **Błąd 500:**
  - Zwracany w przypadku błędów wewnętrznych, np. problemów z przetwarzaniem obrazu przez serwis AI.
- **Rejestrowanie błędów:**
  - Szczegóły błędów zapisywane są w tabeli `generation_error` dla celów debugowania i analizy.

## 8. Rozważania dotyczące wydajności
- **Asynchroniczność:**
  - Choć proces generacji może być synchroniczny w MVP, rozważenie implementacji przetwarzania asynchronicznego w przyszłości w celu zmniejszenia czasu odpowiedzi.
- **Skalowalność:**
  - Optymalizacja zapytań do bazy danych (korzystanie z indeksów, odpowiednia konfiguracja RLS) oraz potencjalne skalowanie usług AI.
- **Monitoring:**
  - Implementacja logowania i monitoringu w celu identyfikacji wąskich gardeł oraz szybkiego reagowania na ewentualne problemy.

## 9. Etapy wdrożenia
1. **Utworzenie endpointu API:**
   - Dodanie nowego pliku w katalogu `/src/pages/api/generation-sessions` zgodnie z zasadami Astro.
2. **Implementacja middleware:**
   - Weryfikacja tokena JWT i ustawienie kontekstu użytkownika.
3. **Walidacja danych wejściowych:**
   - Sprawdzenie obecności i formatu przesłanego pliku `image`.
4. **Utworzenie serwisu generacji:**
   - Utworzenie lub rozszerzenie serwisu w `src/lib/services/generation.service.ts` do obsługi logiki komunikacji z zewnętrznym API AI. Na tym etapie użyjemy mocka zamiast wywołania AI.
5. **Integracja z zewnętrznym API AI:**
   - Implementacja wywołania zewnętrznego serwisu, przetwarzanie odpowiedzi oraz mapowanie na wewnętrzne struktury (DTO).
6. **Rejestracja sesji generacji i błędów:**
   - Zapis wygenerowanej sesji w tabeli `generation_session` oraz ewentualnych błędów w tabeli `generation_error`.
7. **Obsługa błędów i zwracanie odpowiednich kodów statusu:**
   - Implementacja obsługi wyjątków z komunikatami i kodami: 400, 401, 500.
8. **Testy:**
   - Przeprowadzenie testów jednostkowych i integracyjnych endpointu.
9. **Wdrożenie:**
   - Code review, optymalizacja oraz wdrożenie na wybrane środowisko (np. staging, potem produkcja). 