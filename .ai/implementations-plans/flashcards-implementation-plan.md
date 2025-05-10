# API Endpoint Implementation Plan: Manual Flashcard Operations

## 1. Przegląd punktu końcowego
Endpointy umożliwiają zarządzanie fiszkami manualnymi (CRUD) dla uwierzytelnionych użytkowników. Umożliwiają tworzenie, pobieranie, aktualizację oraz usuwanie fiszek. Funkcjonalność obejmuje także filtrowanie fiszek według tagów oraz paginację wyników.

## 2. Szczegóły żądania
- **Metody HTTP:**
  - GET `/api/flashcards`: Lista fiszek z paginacją i opcjonalnym filtrowaniem według tagów.
  - GET `/api/flashcards/{id}`: Pobranie szczegółów wybranej fiszki.
  - POST `/api/flashcards`: Utworzenie nowej fiszki manualnej.
  - PUT `/api/flashcards/{id}`: Aktualizacja istniejącej fiszki.
  - DELETE `/api/flashcards/{id}`: Usunięcie fiszki.

- **Parametry:**
  - Dla GET `/api/flashcards`:
    - Wymagane: `page` (number), `limit` (number)
    - Opcjonalne: `tags` (array of string, np. `?tags=tag1&tags=tag2`)

- **Request Body (dla POST i PUT):**
  ```json
  {
    "front": "Sample front text",
    "back": "Sample back text",
    "phonetic": "Optional phonetic",
    "tags": ["tag1", "tag2"]
  }
  ```
  - `front` oraz `back` są wymagane i nie mogą być puste.
  - `phonetic` jest opcjonalne.
  - `tags` to tablica stringów, maksymalnie 4 tagi.

## 3. Wykorzystywane typy
- **FlashcardDTO:** Reprezentuje dane fiszki pobrane z bazy danych.
- **CreateFlashcardCommand:** Model danych do tworzenia nowej fiszki.
- **UpdateFlashcardCommand:** Model danych do aktualizacji istniejącej fiszki.
- **DeleteFlashcardCommand:** Model danych do usunięcia fiszki.

## 4. Szczegóły odpowiedzi
- **GET `/api/flashcards`:**
  - 200 OK – Zwraca listę fiszek wraz z informacjami o paginacji.
- **GET `/api/flashcards/{id}`:**
  - 200 OK – Zwraca szczegółowe dane fiszki.
  - 404 Not Found – Fiszka nie istnieje lub nie należy do użytkownika.
- **POST `/api/flashcards`:**
  - 201 Created – Zwraca utworzoną fiszkę.
  - 400 Bad Request – Błędne dane wejściowe.
- **PUT `/api/flashcards/{id}`:**
  - 200 OK – Zwraca zaktualizowaną fiszkę.
  - 400 Bad Request – Błędne dane wejściowe.
  - 404 Not Found – Fiszka nie została znaleziona.
- **DELETE `/api/flashcards/{id}`:**
  - 200 OK – Potwierdzenie usunięcia fiszki.
  - 404 Not Found – Fiszka nie istnieje.

## 5. Przepływ danych
1. Żądanie trafia do endpointa API (np. `/api/flashcards` lub `/api/flashcards/{id}`).
2. Middleware weryfikuje autentykację użytkownika, korzystając z `context.locals.supabase`.
3. Dane wejściowe są walidowane przy użyciu Zod (np. wymagalność `front`, `back` oraz ograniczenie do maks. 4 tagów).
4. Logika biznesowa jest wyodrębniona do serwisu (np. `src/lib/services/flashcard.service.ts`), który:
   - Zarządza operacjami na tabelach `flashcards` i `tags` w bazie danych Supabase.
   - Upewnia się, że operacje dotyczą tylko danych zalogowanego użytkownika.
5. Operacje bazodanowe są wykonywane przez klienta Supabase, a wyniki są zwracane do endpointa.
6. Endpoint zwraca odpowiedź w formacie JSON wraz z właściwym kodem stanu HTTP.

## 6. Względy bezpieczeństwa
- **Autoryzacja:** Upewnić się, że użytkownik jest uwierzytelniony (sprawdzenie `context.locals.supabase`) i ma dostęp tylko do swoich danych.
- **Walidacja:** Wykorzystanie Zod do walidacji danych przychodzących, aby zagwarantować integralność danych (niepuste pola, maks. 4 tagi).
- **Sanityzacja danych:** Zapobieganie atakom SQL Injection oraz XSS poprzez odpowiednią sanitizację wejścia.
- **Kody stanu HTTP:** Właściwe użycie 401 dla braku autoryzacji, 403 dla zakazanego dostępu, 404 dla nieznalezionych zasobów oraz 500 dla błędów serwera.

## 7. Obsługa błędów
- **400 Bad Request:** W przypadku niewłaściwych danych wejściowych lub niespełnienia warunków walidacji.
- **401 Unauthorized:** Gdy użytkownik nie jest zalogowany lub brak poprawnej sesji.
- **404 Not Found:** Gdy wskazana fiszka nie istnieje lub nie należy do użytkownika.
- **500 Internal Server Error:** W przypadku nieoczekiwanych błędów serwera.

## 8. Rozważania dotyczące wydajności
- **Paginate Results:** Ograniczenie liczby wyników zwracanych przez GET w celu zwiększenia wydajności.
- **Indeksy bazy danych:** Użycie indeksów na kolumnach `user_id` i `tags` dla optymalizacji zapytań.
- **Optymalizacja zapytań:** Agregacja danych (join) w celu zminimalizowania liczby zapytań do bazy.

## 9. Etapy wdrożenia
1. **Struktura plików:** Utworzenie endpointów w katalogu `src/pages/api/flashcards/`, w tym:
   - `index.ts` – dla GET (lista) i POST (tworzenie).
   - `[id].ts` – dla GET (szczegóły), PUT (aktualizacja) i DELETE (usunięcie).
2. **Middleware:** Implementacja middleware do weryfikacji autentykacji przy użyciu `context.locals.supabase`.
3. **Walidacja:** Definicja schematów walidacji przy pomocy Zod dla payloadów POST i PUT.
4. **Logika biznesowa:** Wyodrębnienie logiki CRUD do serwisu w `src/lib/services/flashcard.service.ts`.
5. **Operacje bazodanowe:** Interakcja z bazą danych przy użyciu Supabase. Upewnienie się, że operacje dotyczą tylko danych danego użytkownika.
6. **Obsługa błędów:** Implementacja odpowiednich kodów odpowiedzi i centralnego logowania błędów.
7. **Testowanie:** Przeprowadzenie testów jednostkowych i integracyjnych dla wszystkich endpointów.
8. **Code Review i wdrożenie:** Weryfikacja kodu przez zespół, poprawki i ostateczne wdrożenie. 