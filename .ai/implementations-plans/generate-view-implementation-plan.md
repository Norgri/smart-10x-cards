/* Plan implementacji widoku Generowanie fiszek */
# Plan implementacji widoku Generowanie fiszek

## 1. Przegląd
Widok umożliwia użytkownikowi przesłanie zdjęcia pojedynczej strony podręcznika oraz automatyczne wygenerowanie fiszek za pomocą AI. Po przesłaniu obrazka, użytkownik widzi wskaźnik ładowania, a po zakończeniu procesu – wygenerowane fiszki prezentowane w formie kart. Umożliwia także akceptację, edycję i odrzucanie wygenerowanych fiszek.

## 2. Routing widoku
Widok będzie dostępny pod ścieżką `/generate`.

## 3. Struktura komponentów
- **GenerateFlashcardsView** (główny komponent widoku)
  - **UploadSection** (obsługa przesyłania zdjęcia)
    - FileInput (input pliku, akceptujący JPG/PNG)
    - GenerateButton (przycisk "Generuj")
  - **Spinner** (wizualny wskaźnik ładowania)
  - **Alert** (komunikaty błędów z shadcn/ui)
  - **FlashcardsGrid** (siatka wyświetlająca wygenerowane fiszki)
    - **FlashcardItem** (pojedyncza fiszka z przyciskami: Akceptuj, Edytuj, Odrzuć)

## 4. Szczegóły komponentów

### GenerateFlashcardsView
- **Opis:** Główny kontener widoku, zarządza stanem, logiką przesyłania zdjęcia oraz integracją z API.
- **Główne elementy:** UploadSection, Spinner, Alert, FlashcardsGrid.
- **Obsługiwane interakcje:** Przekazywanie wybranego pliku do funkcji generującej, aktualizacja stanu (loading, error, flashcards).
- **Warunki walidacji:** Przechwytywanie błędów przesyłania, walidacja odpowiedzi API.
- **Typy:** Stan widoku (plik, loading, error, flashcards, sessionId).

### UploadSection
- **Opis:** Odpowiedzialny za selekcję zdjęcia i wywołanie akcji generowania.
- **Główne elementy:** Input pliku (akceptuje tylko JPG/PNG, max 10MB), przycisk "Generuj".
- **Obsługiwane interakcje:** onChange (wybór pliku) i onClick (inicjacja żądania generowania).
- **Warunki walidacji:** Sprawdzenie formatu pliku i rozmiaru przed wysłaniem.
- **Typy:** Użycie typu GenerateFlashcardsFromImageCommand.

### Spinner
- **Opis:** Wizualny wskaźnik informujący o trwającym procesie generowania.
- **Główne elementy:** Animowany element z obracającą się obwódką.
- **Obsługiwane interakcje:** Brak; reaguje na stan loading.
- **Warunki walidacji:** Wyświetlany gdy state.loading === true.

### Alert
- **Opis:** Wyświetla komunikaty błędów z biblioteki shadcn/ui.
- **Główne elementy:** Komponent Alert z wariantem destructive.
- **Obsługiwane interakcje:** Brak, wyłącznie prezentacja błędu.
- **Warunki walidacji:** Pokazuje treść błędu z stanu widoku.

### FlashcardsGrid
- **Opis:** Prezentuje wygenerowane fiszki w siatce.
- **Główne elementy:** Lista komponentów FlashcardItem.
- **Obsługiwane interakcje:** Renderowanie listy fiszek.
- **Warunki walidacji:** Wyświetlane tylko gdy dane są dostępne.

### FlashcardItem
- **Opis:** Pojedyncza karta prezentująca fiszkę z informacjami (przód, tył, opcjonalnie fonetyka, tagi) oraz akcjami.
- **Główne elementy:** 
  - Tryb odczytu: Teksty zawartości, przyciski "Akceptuj", "Edytuj", "Odrzuć"
  - Tryb edycji: Formularz edycji z polami front, back, phonetic, tags oraz przyciskami "Zapisz" i "Anuluj"
- **Obsługiwane interakcje:** 
  - onClick przycisków w trybie odczytu:
    - Akceptuj: Wywołanie API logujące akcję akceptacji
    - Edytuj: Przełączenie na tryb edycji
    - Odrzuć: Wywołanie API logujące akcję odrzucenia i fiszki z widoku (opcjonalne potwierdzenie)
  - onClick przycisków w trybie edycji:
    - Zapisz: Wywołanie API logujące akcję edycji i usunięcie fiszki z widoku
    - Anuluj: Anulowanie zmian i przełączenie na tryb odczytu
- **Warunki walidacji:** 
  - Weryfikacja obecności wymaganych pól (front, back)
  - Maksymalnie 4 tagi
  - Walidacja przed wysłaniem akcji
- **Typy:** Używa typu GeneratedFlashcardDTO oraz lokalnego stanu dla trybu edycji

## 5. Typy
- **GeneratedFlashcardDTO:** { front: string, back: string, phonetic?: string | null, tags: string[], source: "ai" }
- **GenerationSessionDTO:** { id: string, flashcards?: GeneratedFlashcardDTO[], errors?: { id: number, errorCode: string, errorMessage: string }[], createdAt: string }
- **GenerateFlashcardsFromImageCommand:** { image: File }
- **LogFlashcardActionCommand:** { actionType: "accepted" | "edited" | "rejected", generatedFlashcard?: GeneratedFlashcardDTO }
- **FlashcardsViewState:** { loading: boolean, error: string | null, flashcards: GeneratedFlashcardDTO[], sessionId: string | null }

## 6. Zarządzanie stanem
Widok zarządza stanem przy użyciu hooków:
- useState dla przechowywania wybranego pliku, stanu ładowania, błędów, danych fiszek oraz sessionId.
- Ewentualny custom hook `useGenerateFlashcards` dla zarządzania logiką wywołania API (przesyłanie pliku, pobieranie odpowiedzi, reset stanu błędu i aktualizacja stanu).

## 7. Integracja API
Integracja odbywa się z następującymi endpointami:
- **POST /api/generation-sessions**
  - Żądanie: Multipart/form-data z polem `image`.
  - Odpowiedź: GenerationSessionDTO (zawiera id sesji, tablicę wygenerowanych fiszek oraz ewentualne błędy).
- **POST /api/generation-sessions/{session_id}/flashcard-actions**
  - Żądanie: JSON zawierający { actionType, generatedFlashcard }.
  - Odpowiedź: LogActionDTO zawierający szczegóły logowania akcji.
Integracja realizowana za pomocą funkcji fetch z odpowiednim parsowaniem JSON.

## 8. Interakcje użytkownika
- Wybór zdjęcia: Użytkownik wybiera plik (JPG/PNG, do 10MB) poprzez UploadSection.
- Inicjacja generowania: Po kliknięciu przycisku "Generuj" wywoływana jest funkcja API, a pojawia się Spinner.
- Prezentacja wyników: Po sukcesie, fiszki wyświetlane są w FlashcardsGrid.
- Akcje na fiszkach: Użytkownik może zatwierdzić, edytować lub odrzucić fiszkę, co wywołuje odpowiednie wywołania API.
- Obsługa błędów: W przypadku błędu pliku lub API, Alert prezentuje komunikat informujący o problemie.

## 9. Warunki i walidacja
- **Przed wysłaniem:** Walidacja pliku – typ (JPG/PNG) i rozmiar (<=10MB).
- **Podczas wysyłania:** Monitorowanie stanu loading oraz sprawdzanie statusu odpowiedzi API (201 = sukces, 400/500 = błąd).
- **Podczas akcji na fiszce:** Weryfikacja obecności wymaganych pól (front, back, poprawna liczba tagów) przed logowaniem akcji.

## 10. Obsługa błędów
- Walidacja pliku: W przypadku nieprawidłowego formatu lub rozmiaru, wyświetlenie komunikatu błędu.
- Błędy API: Jeśli odpowiedź zwraca błąd (400, 500), Alert prezentuje odpowiedni komunikat, np. "Nie udało się wygenerować fiszek. Spróbuj ponownie.".
- Błędy operacji na fiszkach: Logowanie błędów oraz wyświetlanie komunikatów dla użytkownika przy nieudanych akcjach (akceptacja, edycja, odrzucenia).

## 11. Kroki implementacji
1. Utworzenie komponentu strony `GenerateFlashcardsView` w folderze `/src/pages`.
2. Implementacja komponentu `UploadSection` z inputem pliku i przyciskiem "Generuj", wraz z walidacją pliku (format, rozmiar).
3. Dodanie hooków useState do zarządzania stanem: wybrany plik, loading, error, flashcards oraz sessionId.
4. Implementacja funkcji integrującej z endpointem POST `/api/generation-sessions` przy użyciu fetch i FormData.
5. Stworzenie komponentu `Spinner` do wyświetlania wskaźnika ładowania.
6. Wykorzystanie komponentu `Alert` z shadcn/ui do prezentacji komunikatów błędów.
7. Implementacja komponentu `FlashcardsGrid` wraz z komponentem `FlashcardItem` do prezentacji wygenerowanych fiszek.
8. Implementacja trybu edycji dla komponentu `FlashcardItem`:
   - Dodanie stanu lokalnego dla trybu edycji
   - Stworzenie formularza edycji z polami front, back, phonetic i tags
   - Implementacja przycisków Zapisz i Anuluj
   - Walidacja pól formularza
   - Integracja z akcją "edited" w API
9. Dodanie funkcji obsługujących akcje na fiszkach (Akceptuj, Edytuj, Odrzuć) z integracją do endpointu POST `/api/generation-sessions/{session_id}/flashcard-actions`.
10. Code review oraz ewentualne poprawki zgodnie z feedbackiem. 