# Plan Testów dla Smart 10x Cards

## 1. Wprowadzenie

### Cel planu testów
Celem niniejszego planu testów jest zapewnienie wysokiej jakości aplikacji Smart 10x Cards poprzez systematyczne testowanie wszystkich kluczowych funkcjonalności. Plan definiuje strategie, przypadki testowe oraz narzędzia, które pozwolą na efektywne wykrywanie błędów przed wdrożeniem produkcyjnym.

### Zakres testowania
Plan obejmuje testowanie wszystkich funkcjonalności aplikacji Smart 10x Cards, w tym:
- Rejestrację i autentykację użytkowników
- Generowanie fiszek przy użyciu AI na podstawie zdjęć
- Ręczne tworzenie i zarządzanie fiszkami
- Wyszukiwanie i filtrowanie fiszek
- Interfejs użytkownika i responsywność
- Integracje z usługami zewnętrznymi (Supabase, OpenRouter.ai)

## 2. Strategia testowania

### Typy testów do przeprowadzenia

1. **Testy jednostkowe**
   - Testowanie pojedynczych komponentów i funkcji
   - Sprawdzanie poprawności logiki biznesowej
   - Weryfikacja walidacji danych

2. **Testy integracyjne**
   - Testowanie interakcji między komponentami
   - Sprawdzanie integracji z Supabase (baza danych, autentykacja)
   - Weryfikacja integracji z OpenRouter.ai (generowanie fiszek przez AI)

3. **Testy end-to-end (E2E)**
   - Testowanie kompletnych ścieżek użytkownika
   - Weryfikacja procesu rejestracji i logowania
   - Sprawdzanie procesu generowania fiszek od wgrania obrazu po zapisanie w bazie

4. **Testy UI/UX**
   - Weryfikacja responsywności na różnych urządzeniach
   - Sprawdzanie dostępności (WCAG)
   - Testowanie UX pod kątem intuicyjności interfejsu

5. **Testy wydajnościowe**
   - Sprawdzanie czasu odpowiedzi API
   - Testowanie wydajności generowania fiszek przy użyciu AI
   - Weryfikacja wydajności przy dużej liczbie fiszek

### Priorytety testowania

1. **Wysoki priorytet**
   - Autentykacja użytkowników (rejestracja, logowanie)
   - Generowanie fiszek przy użyciu AI
   - Zapisywanie i pobieranie fiszek z bazy danych
   - Podstawowe operacje CRUD na fiszkach

2. **Średni priorytet**
   - Wyszukiwanie i filtrowanie fiszek
   - Zarządzanie tagami
   - Walidacja danych wejściowych
   - Responsywność interfejsu użytkownika

3. **Niski priorytet**
   - Optymalizacja wydajności
   - Zaawansowane funkcje UI
   - Raportowanie błędów i analityka

### Podejście do testowania

Testowanie będzie prowadzone przy użyciu podejścia hybrydowego:
- Automatyczne testy jednostkowe i integracyjne dla krytycznych komponentów
- Manualne testy eksploracyjne dla funkcjonalności UI/UX
- Testowanie wydajnościowe przy użyciu narzędzi automatycznych

## 3. Środowisko testowe

### Wymagania sprzętowe i programowe

1. **Środowisko deweloperskie**
   - Node.js w wersji określonej w pliku .nvmrc
   - NPM
   - Nowoczesne przeglądarki (Chrome, Firefox, Safari, Edge)
   - Różne urządzenia do testów responsywności (desktop, tablet, mobile)

2. **Środowisko testowe**
   - Lokalne środowisko developerskie
   - Środowisko staging na DigitalOcean
   - Lokalna instancja Supabase lub testowe konto Supabase
   - Testowe konto OpenRouter.ai

### Konfiguracja środowiska testowego

1. Przygotowanie lokalnego środowiska developerskiego:
   - Instalacja Node.js i zależności
   - Konfiguracja lokalnej bazy danych
   - Konfiguracja zmiennych środowiskowych

2. Konfiguracja środowiska testowego w chmurze:
   - Wdrożenie aplikacji na środowisku staging
   - Konfiguracja testowej bazy danych Supabase
   - Konfiguracja limitów API dla OpenRouter.ai

## 4. Przypadki testowe

### Autentykacja użytkowników

1. **Rejestracja użytkownika**
   - **Warunki wstępne**: Użytkownik nie jest zalogowany
   - **Kroki**:
     1. Otwarcie strony rejestracji
     2. Wprowadzenie poprawnych danych (email, hasło)
     3. Kliknięcie przycisku "Zarejestruj"
   - **Oczekiwany wynik**: Użytkownik zostaje zarejestrowany i przekierowany na dashboard
   - **Kryteria akceptacji**: Konto zostaje utworzone w Supabase, użytkownik otrzymuje token uwierzytelniający

2. **Logowanie użytkownika**
   - **Warunki wstępne**: Użytkownik posiada konto
   - **Kroki**:
     1. Otwarcie strony logowania
     2. Wprowadzenie poprawnych danych (email, hasło)
     3. Kliknięcie przycisku "Zaloguj"
   - **Oczekiwany wynik**: Użytkownik zostaje zalogowany i przekierowany na dashboard
   - **Kryteria akceptacji**: Użytkownik otrzymuje token uwierzytelniający, sesja jest aktywna

3. **Walidacja formularza rejestracji**
   - **Warunki wstępne**: Użytkownik nie jest zalogowany
   - **Kroki**:
     1. Otwarcie strony rejestracji
     2. Wprowadzenie niepoprawnych danych (np. zły format email, zbyt krótkie hasło)
     3. Próba rejestracji
   - **Oczekiwany wynik**: Wyświetlenie komunikatów o błędach walidacji
   - **Kryteria akceptacji**: Użytkownik otrzymuje jasne komunikaty o problemach z danymi

### Generowanie fiszek przy użyciu AI

1. **Wgrywanie obrazu**
   - **Warunki wstępne**: Użytkownik jest zalogowany
   - **Kroki**:
     1. Przejście do sekcji generowania fiszek
     2. Wgranie poprawnego obrazu (JPG/PNG)
   - **Oczekiwany wynik**: Obraz zostaje wgrany i przekazany do przetwarzania
   - **Kryteria akceptacji**: Obraz jest walidowany pod kątem formatu i rozmiaru

2. **Generowanie fiszek z obrazu**
   - **Warunki wstępne**: Użytkownik wgrał obraz
   - **Kroki**:
     1. Oczekiwanie na przetworzenie obrazu przez AI
   - **Oczekiwany wynik**: System generuje fiszki na podstawie zawartości obrazu
   - **Kryteria akceptacji**: Fiszki zawierają poprawnie wyekstrahowany tekst, tłumaczenie i opcjonalnie transkrypcję fonetyczną

3. **Akceptacja wygenerowanych fiszek**
   - **Warunki wstępne**: System wygenerował fiszki
   - **Kroki**:
     1. Przeglądanie wygenerowanych fiszek
     2. Akceptacja wybranych fiszek
   - **Oczekiwany wynik**: Zaakceptowane fiszki zostają zapisane w bazie danych
   - **Kryteria akceptacji**: Fiszki są dostępne w dashboardzie użytkownika

### Ręczne zarządzanie fiszkami

1. **Tworzenie nowej fiszki**
   - **Warunki wstępne**: Użytkownik jest zalogowany
   - **Kroki**:
     1. Przejście do sekcji tworzenia fiszki
     2. Wprowadzenie danych fiszki (front, back, phonetic, tags)
     3. Zapisanie fiszki
   - **Oczekiwany wynik**: Fiszka zostaje utworzona i zapisana w bazie
   - **Kryteria akceptacji**: Fiszka jest dostępna w dashboardzie użytkownika

2. **Edycja istniejącej fiszki**
   - **Warunki wstępne**: Użytkownik posiada przynajmniej jedną fiszkę
   - **Kroki**:
     1. Wybranie fiszki do edycji
     2. Zmiana danych fiszki
     3. Zapisanie zmian
   - **Oczekiwany wynik**: Zmiany zostają zapisane w bazie
   - **Kryteria akceptacji**: Zaktualizowana fiszka wyświetla nowe dane

3. **Usuwanie fiszki**
   - **Warunki wstępne**: Użytkownik posiada przynajmniej jedną fiszkę
   - **Kroki**:
     1. Wybranie fiszki do usunięcia
     2. Potwierdzenie usunięcia
   - **Oczekiwany wynik**: Fiszka zostaje usunięta z bazy
   - **Kryteria akceptacji**: Fiszka nie jest już widoczna w dashboardzie

### Wyszukiwanie i filtrowanie fiszek

1. **Wyszukiwanie fiszek po tekście**
   - **Warunki wstępne**: Użytkownik posiada kilka fiszek
   - **Kroki**:
     1. Wprowadzenie tekstu w pole wyszukiwania
   - **Oczekiwany wynik**: Wyświetlenie fiszek zawierających szukany tekst
   - **Kryteria akceptacji**: Lista wyników zawiera tylko fiszki pasujące do kryterium

2. **Filtrowanie fiszek po tagach**
   - **Warunki wstępne**: Użytkownik posiada fiszki z różnymi tagami
   - **Kroki**:
     1. Wybranie tagów do filtrowania
   - **Oczekiwany wynik**: Wyświetlenie fiszek z wybranymi tagami
   - **Kryteria akceptacji**: Lista wyników zawiera tylko fiszki z wybranymi tagami

## 5. Harmonogram testów

### Szacunkowy czas trwania każdej fazy testowania

1. **Przygotowanie środowiska testowego**: 1 dzień
2. **Implementacja testów jednostkowych**: 3 dni
3. **Implementacja testów integracyjnych**: 3 dni
4. **Implementacja testów E2E**: 2 dni
5. **Manualne testy UI/UX**: 2 dni
6. **Testy wydajnościowe**: 1 dzień
7. **Raportowanie i naprawa błędów**: 3 dni

### Kamienie milowe w procesie testowania

1. **Milestone 1**: Przygotowanie środowiska i implementacja podstawowych testów jednostkowych
2. **Milestone 2**: Pokrycie testami wszystkich kluczowych funkcjonalności
3. **Milestone 3**: Ukończenie testów integracyjnych i E2E
4. **Milestone 4**: Zakończenie manualnych testów i usunięcie krytycznych błędów
5. **Milestone 5**: Finalizacja raportu z testów i przekazanie aplikacji do wdrożenia

## 6. Narzędzia testowe

### Lista rekomendowanych narzędzi do testowania

1. **Testy jednostkowe i integracyjne**
   - Vitest - framework do testów jednostkowych i integracyjnych
   - React Testing Library - biblioteka do testowania komponentów React
   - MSW (Mock Service Worker) - do mockowania API

2. **Testy E2E**
   - Playwright - framework do testów E2E

3. **Testy wydajnościowe**
   - Lighthouse - do testowania wydajności frontendu
   - k6 - do testowania wydajności API

4. **Testy UI/UX**
   - Storybook - do izolowanego testowania komponentów UI
   - Axe - do testowania dostępności

### Uzasadnienie wyboru narzędzi

- **Vitest + React Testing Library**: Świetne wsparcie dla React i TypeScript, integracja z Astro
- **Playwright**: Nowoczesny framework E2E z obsługą wielu przeglądarek, automatycznym wyczekiwaniem na elementy UI
- **Lighthouse**: Zintegrowane z DevTools narzędzie do testowania wydajności
- **Storybook**: Umożliwia izolowane testowanie komponentów UI w różnych stanach
- **MSW**: Pozwala na mockowanie API bez konieczności modyfikacji kodu aplikacji

## 7. Raportowanie i śledzenie błędów

### Proces raportowania błędów

1. Wykrycie błędu podczas testowania
2. Dokumentacja błędu z niezbędnymi szczegółami:
   - Środowisko testowe
   - Kroki reprodukcji
   - Oczekiwane vs. rzeczywiste zachowanie
   - Zrzuty ekranu/nagrania
3. Kategoryzacja błędu według priorytetu:
   - Krytyczny - blokuje kluczową funkcjonalność
   - Wysoki - powoduje nieprawidłowe działanie, ale nie blokuje całkowicie
   - Średni - wpływa na UX, ale nie powoduje nieprawidłowego działania
   - Niski - kosmetyczny lub mało istotny

### Narzędzia do śledzenia błędów

1. **GitHub Issues** - do śledzenia błędów i przypisywania ich do deweloperów
2. **Automatyczne raportowanie z testów** - integracja testów z CI/CD
3. **Dokumentacja błędów** - standardowy szablon opisu błędu

## 8. Kryteria zakończenia testów

### Warunki, które muszą być spełnione, aby uznać testy za zakończone

1. **Pokrycie testami**:
   - 80% pokrycia dla kodu biznesowego
   - 90% pokrycia dla krytycznych ścieżek (autentykacja, generowanie fiszek)

2. **Jakość kodu**:
   - Brak błędów wykrytych przez statyczną analizę kodu
   - Brak błędów wykrytych przez linteryi ESLint/Prettier

3. **Krytyczne funkcjonalności**:
   - Wszystkie przypadki testowe dla krytycznych funkcjonalności zakończone powodzeniem
   - Brak otwartych błędów o priorytecie krytycznym lub wysokim

4. **Wydajność**:
   - Czas ładowania strony poniżej 2 sekund
   - Czas odpowiedzi API poniżej 500ms
   - Czas generowania fiszek poniżej 5 sekund

## 9. Ryzyka i plany awaryjne

### Identyfikacja potencjalnych ryzyk w procesie testowania

1. **Niestabilność API OpenRouter.ai**
   - **Ryzyko**: Problemy z dostępnością lub wydajnością API do generowania fiszek
   - **Wpływ**: Niemożność przetestowania kluczowej funkcjonalności
   - **Prawdopodobieństwo**: Średnie

2. **Problemy z konfiguracją środowiska testowego**
   - **Ryzyko**: Trudności w konfiguracji lokalnego środowiska Supabase
   - **Wpływ**: Opóźnienia w rozpoczęciu testów
   - **Prawdopodobieństwo**: Niskie

3. **Zmiany w API zewnętrznych**
   - **Ryzyko**: Zmiany w API Supabase lub OpenRouter.ai
   - **Wpływ**: Konieczność dostosowania kodu i testów
   - **Prawdopodobieństwo**: Niskie

4. **Ograniczenia wydajnościowe**
   - **Ryzyko**: Problemy z wydajnością przy dużej liczbie fiszek
   - **Wpływ**: Negatywne doświadczenie użytkownika
   - **Prawdopodobieństwo**: Średnie

### Strategie mitygacji ryzyk

1. **Niestabilność API OpenRouter.ai**
   - Przygotowanie mocków do testowania offline
   - Ustalenie okien czasowych na testy integracyjne z rzeczywistym API
   - Monitorowanie statusu API

2. **Problemy z konfiguracją środowiska testowego**
   - Przygotowanie dokładnej dokumentacji konfiguracji
   - Automatyzacja procesu konfiguracji
   - Przygotowanie alternatywnych środowisk testowych

3. **Zmiany w API zewnętrznych**
   - Regularne sprawdzanie dokumentacji API
   - Modularyzacja kodu integracyjnego
   - Przygotowanie adaptorów do obsługi różnych wersji API

4. **Ograniczenia wydajnościowe**
   - Wczesne testy wydajnościowe
   - Przygotowanie strategii paginacji i ładowania danych
   - Optymalizacja zapytań do bazy danych 