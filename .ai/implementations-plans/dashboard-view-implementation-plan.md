# Plan implementacji widoku Dashboard

## 1. Przegląd
Widok Dashboard ma na celu umożliwienie zalogowanemu użytkownikowi:
- Przeglądanie (US-010) wszystkich zapisanych fiszek (zarówno manualnie utworzonych, jak i wygenerowanych przez AI).
- Ręczne dodawanie nowych fiszek (US-009) poprzez formularz, który zawiera pola: przód, tył, opcjonalny zapis fonetyczny oraz tagi (maksymalnie 4).
- Wyszukiwanie oraz filtrowanie fiszek po tagach (US-011).
- Edycję (US-012) oraz usuwanie (US-013) istniejących fiszek.
- Obsługę opcjonalnego zapisu fonetycznego (US-016).

## 2. Routing widoku
Widok powinien być dostępny pod ścieżką:
- `/` jako widok domyślny po zalogowaniu

## 3. Struktura komponentów
- **DashboardPage** – główny kontener widoku.
  - **ManualFlashcardForm** – formularz do tworzenia nowej fiszki.
  - **SearchBar** – pole wyszukiwania oraz filtr tagów.
  - **DashboardFlashcardsGrid** – dedykowany komponent do wyświetlania listy manualnych fiszek. Wykorzystuje nowy komponent **DashboardFlashcardItem**.
  - **EmptyState** - Komponent prezentujący pusty stan widoku Dashboard.

## 4. Szczegóły komponentów
### DashboardPage
- **Opis:** Główny komponent strony Dashboard. Zarządza stanem listy fiszek, stanem filtrów oraz integracją z API.
- **Główne elementy:** 
  - Kontener (np. `<main>` lub `<section>`), nagłówek, sekcje z formularzem, polem wyszukiwania i listą fiszek.
- **Obsługiwane interakcje:** 
  - Pobranie fiszek z API przy ładowaniu strony oraz po zmianie filtrów.
  - Aktualizacja listy po dodaniu, edycji lub usunięciu fiszki.
  - Sprawdzanie, czy pobrana lista fiszek jest pusta. Jeśli tak, zamiast komponentu `DashboardFlashcardsGrid` renderowany jest komponent `EmptyState`, który wyświetla przyjazny komunikat, uproszczoną ilustrację oraz dwa przyciski CTA: "Add Flashcard" (do formularza ręcznego tworzenia fiszki) oraz "Generate Flashcards" (do widoku generacji fiszek AI).
- **Typy i dane:** 
  - Używa typów z `FlashcardDTO`, `CreateFlashcardCommand` oraz `UpdateFlashcardCommand` z `types.ts`.
- **Propsy:** 
  - Brak, gdyż jest stroną (widok samodzielny).

### ManualFlashcardForm
- **Opis:** Formularz do ręcznego dodawania nowej fiszki.
- **Główne elementy:** 
  - Pola wejściowe: tekstowe dla przodu, tyłu, opcjonalnego zapisu fonetycznego oraz zarządzania tagami (input tekstowy z separacją przecinkami).
  - Przycisk do zatwierdzenia utworzenia fiszki.
- **Obsługiwane interakcje:** 
  - Walidacja pól (przód i tył wymagane, max 4 tagi, ograniczenie długości tagu – np. 50 znaków).
  - Wysyłka formularza do API POST `/api/flashcards`.
  - Resetowanie pól po pomyślnym zapisie.
- **Typy:** 
  - Nowy typ ViewModel na potrzeby formularza (np. `ManualFlashcardViewModel` z polami: front (string), back (string), phonetic (string), tags (string)).
- **Propsy:** 
  - Funkcja callback do dodania nowo utworzonej fiszki do listy w `DashboardPage`.

### SearchBar
- **Opis:** Komponent umożliwiający wyszukiwanie i filtrowanie fiszek po tagach.
- **Główne elementy:** 
  - Pole tekstowe lub zestaw elementów do wyboru tagów (możliwość wpisania tagu lub wybrania z listy).
- **Obsługiwane interakcje:** 
  - Dynamiczna aktualizacja listy fiszek w DashboardPage w zależności od wprowadzonego filtru.
- **Typy:** 
  - Prosty typ: `string` lub tablica stringów reprezentująca wybrane tagi.
- **Propsy:** 
  - Callback zwracający aktualny filtr tagów do rodzica (DashboardPage).

### DashboardFlashcardsGrid
- **Opis:** Dedykowany komponent do prezentowania listy manualnych fiszek. Renderuje listę fiszek przy użyciu komponentu `DashboardFlashcardItem`.
- **Główne elementy:** 
  - Renderuje listę fiszek zawierającą obiekty typu `FlashcardDTO`.
- **Stylizacja:** Nowy komponent powinien być stylizowany spójnie z komponentem `FlashcardsGrid.tsx`, używając Tailwind oraz komponentów Shadcn/ui.
- **Obsługiwane interakcje:** 
  - Przekazuje zdarzenia akceptacji, edycji oraz usunięcia (onDelete) do DashboardPage.
- **Propsy:** 
  - `flashcards` (tablica obiektów typu `FlashcardDTO`), `onAccept`, `onEdit`, `onDelete`.

### DashboardFlashcardItem
- **Opis:** Komponent prezentujący pojedynczą manualną fiszkę.
- **Główne elementy:** 
  - Wyświetla przód, tył, opcjonalny zapis fonetyczny i tagi.
- **Stylizacja:** Styl komponentu powinien być zgodny z komponentem `FlashcardItem.tsx`, wykorzystując Tailwind oraz Shadcn/ui, aby zachować spójny wygląd aplikacji.
- **Obsługiwane interakcje:** 
  - Akceptacja: powiadamia DashboardPage o akcji akceptacji.
  - Edycja: przełącza fiszkę w tryb edycji, umożliwia modyfikację danych z walidacją, wywołując akcję edycji (PUT API).
  - Usunięcie: wywołuje akcję onDelete, która usuwa fiszkę (DELETE API).
- **Propsy:** 
  - `flashcard` (obiekt typu `FlashcardDTO`), `onAccept`, `onEdit`, `onDelete`.

### EmptyState
- **Opis:** Komponent odpowiedzialny za prezentację pustego stanu widoku Dashboard, gdy użytkownik nie posiada żadnych fiszek.
- **Główne elementy:** 
  - Ilustracja lub ikona zgodna z designem aplikacji.
  - Wyraźny komunikat (np. "You have no flashcards yet!").
  - Dwa przyciski CTA: "Add Flashcard" oraz "Generate Flashcards".
- **Technologie:** 
  - Zaimplementowany jako komponent React, używający TypeScript, stylizowany przy użyciu Tailwind i komponentów Shadcn/ui.

## 5. Typy
- **FlashcardDTO, CreateFlashcardCommand, UpdateFlashcardCommand:** Dostarczone w `src/types.ts`.
- **ManualFlashcardViewModel:** Nowy typ widoku dla formularza tworzenia fiszki:
  ```typescript
  interface ManualFlashcardViewModel {
    front: string;
    back: string;
    phonetic?: string;
    tags: string; // przechowywane jako pojedynczy string z tagami oddzielonymi przecinkami
  }
  ```

## 6. Zarządzanie stanem
- **Stan lokalny w DashboardPage:** 
  - Lista fiszek pobranych z API (`useState<FlashcardDTO[]>`).
  - Stan filtrów (np. tagi do wyszukiwania) – `useState<string[]>([])` lub pojedynczy string.
  - Obsługa stanów ładowania i błędów przy wywołaniach API.
- **Możliwość stworzenia custom hooka:** np. `useFlashcards` do zarządzania pobieraniem i aktualizacją listy fiszek.

## 7. Integracja API
- **GET /api/flashcards:** Pobiera listę fiszek z możliwością filtrowania po tagach. Parametry: `page`, `limit`, `tags`.
  - Żądanie powinno przekazywać odpowiednie query parametry w URL (np. `?tags=tag1,tag2`).
- **POST /api/flashcards:** Tworzy nową fiszkę. Oczekiwane dane: front, back, phonetic (opcjonalnie), tags (tablica stringów). Źródło fiszki powinno być ustawione jako "manual" po stronie backendu.
- **PUT /api/flashcards/[id]:** Aktualizacja istniejącej fiszki po edycji.
- **DELETE /api/flashcards/[id]:** Usunięcie fiszki. 

## 8. Interakcje użytkownika
- Użytkownik widzi listę fiszek w siatce. 
- Po wpisaniu tagu (lub wyborze z listy) w polu wyszukiwania, lista fiszek aktualizuje się dynamicznie (filtracja po API lub front-endowa). 
- Kliknięcie w przycisk "Dodaj fiszkę" (w formularzu) inicjuje walidację, a następnie wysłanie żądania POST.
- W przypadku edycji, użytkownik przełącza fiszkę w tryb edycji (użycie komponentu `DashboardFlashcardItem` z edytowaniem in-place).
- Kliknięcie przycisku usuwania powoduje wywołanie dialogu potwierdzającego, a następnie żądanie DELETE.

## 9. Warunki i walidacja
- **Walidacja formularza tworzenia:** 
  - Pola "front" i "back" nie mogą być puste.
  - Maksymalnie 4 tagi, gdzie każdy tag nie przekracza 50 znaków.
  - Opcjonalny zapis fonetyczny obsługiwany jako pole tekstowe, może być puste.
- **Walidacja edycji:** Podobna walidacja jak w formularzu tworzenia, wykonywana przed wysłaniem żądania PUT.

## 10. Obsługa błędów
- Wyświetlanie komunikatów błędów dla nieudanych wywołań API (np. za pomocą `toast` z biblioteki `sonner`).
- Obsługa błędów walidacyjnych po stronie klienta (np. brak wymaganych pól, za dużo tagów, zbyt długie tagi) z wyświetleniem komunikatu w komponencie.
- Zarządzanie stanem ładowania – wyświetlanie loadera podczas asynchronicznych operacji.

## 11. Kroki implementacji
1. Utworzenie nowego pliku strony Dashboard w `src/pages/index.astro` z integracją komponentu React (jeśli konieczne) dla części interaktywnej.
2. Implementacja komponentu `DashboardPage` jako głównego kontenera widoku.
3. Utworzenie komponentu `ManualFlashcardForm` z polami formularza i walidacją danych.
4. Implementacja komponentu `SearchBar` do filtrowania fiszek po tagach.
5. Integracja istniejącego komponentu `DashboardFlashcardsGrid` do prezentacji listy fiszek.
6. Rozszerzenie logiki `DashboardPage` o sprawdzanie, czy lista fiszek jest pusta; w przypadku pustej listy renderowanie komponentu `EmptyState` zamiast `DashboardFlashcardsGrid`.
7. Utworzenie nowego komponentu `DashboardFlashcardItem` w katalogu `src/components/ui`, dedykowanego dla manualnych fiszek, operującego na typie `FlashcardDTO` oraz obsługującego akcję onDelete (DELETE API).
8. Utworzenie nowego komponentu `DashboardFlashcardsGrid` w katalogu `src/components/ui`, który wykorzysta `DashboardFlashcardItem` do renderowania listy fiszek.
9. Stworzenie custom hooka (np. `useFlashcards`) do obsługi pobierania, dodawania, edycji i usuwania fiszek poprzez wywołania API.
10. Połączenie logiki wywołań API z metodami: GET, POST, PUT i DELETE, przy czym akcja usunięcia fiszki wywołuje endpoint DELETE.
11. Testowanie interakcji użytkownika: tworzenie nowej fiszki, edycja, usuwanie oraz wyszukiwanie po tagach.
12. Udoskonalenie UI oraz obsługa błędów (feedback wizualny dla użytkownika, np. toast notifications).
13. Code review i testy end-to-end.

## 12. Integracja nawigacji
- Widok Dashboard powinien korzystać ze wspólnego layoutu dla widoków zalogowanych, np. `src/layouts/MainLayout.astro`.
- Globalny layout zawiera nawigację opisaną w @ui-plan.md w sekcji "4. Układ i struktura nawigacji", z linkami do głównych widoków: Dashboard, Generowanie fiszek, Sesje generowania, oraz ustawień konta.
- W widoku Dashboard (w `src/pages/index.astro`) należy zaimportować i wykorzystać ten layout, aby zapewnić spójność interfejsu i centralną nawigację.
- Nawigacja powinna dynamicznie zaznaczać aktywny link (np. poprzez porównywanie aktualnej ścieżki), poprawiając UX. 