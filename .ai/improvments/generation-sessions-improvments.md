# Ulepszenia Sesji Generowania

## Mechanizm Cache'owania
### Problem
Obecnie system generuje nowe fiszki za każdym razem, nawet dla identycznych obrazów. Prowadzi to do:
- Niepotrzebnych wywołań API
- Wyższych kosztów
- Dłuższego czasu odpowiedzi
- Niespójnych wyników dla tego samego obrazu

### Proponowane Rozwiązanie
Implementacja mechanizmu cache'owania opartego na hashu obrazu:
1. Obliczanie hasha SHA-256 przesłanego obrazu
2. Przechowywanie wygenerowanych fiszek w Supabase z hashem obrazu jako kluczem
3. Sprawdzanie cache przed wykonaniem wywołań API OpenRouter
4. Implementacja strategii invalidacji cache (np. TTL 30 dni)

### Spodziewane Korzyści
- Zmniejszenie kosztów API
- Szybszy czas odpowiedzi dla powtarzających się obrazów
- Spójne wyniki dla tego samego obrazu
- Lepsza jakość doświadczenia użytkownika

## Monitorowanie API
### Problem
Brak widoczności w zakresie:
- Wzorców użycia API
- Możliwości optymalizacji kosztów
- Wąskich gardeł wydajności
- Wykorzystania limitów żądań

### Proponowane Rozwiązanie
Implementacja middleware monitorującego:
1. Śledzenie wywołań API:
   - Liczba żądań
   - Czasy odpowiedzi
   - Zużycie tokenów
   - Wskaźniki sukcesu/błędów
2. Przechowywanie metryk w Supabase
3. Stworzenie dashboardu monitorującego
4. Konfiguracja alertów dla:
   - Zbliżania się do limitu żądań
   - Nietypowych wskaźników błędów
   - Wysokiego zużycia tokenów

### Spodziewane Korzyści
- Lepsza kontrola kosztów
- System wczesnego ostrzegania o problemach
- Optymalizacja oparta na danych
- Zwiększona niezawodność systemu

## Walidacja Jakości Obrazu
### Problem
Obecna walidacja sprawdza tylko podstawowe parametry (rozmiar, wymiary, format), ale nie faktyczną jakość obrazu. Może to prowadzić do:
- Słabych wyników OCR
- Niepotrzebnych wywołań API dla nieczytelnych obrazów
- Frustrującego doświadczenia użytkownika

### Proponowane Rozwiązanie
Implementacja zaawansowanych sprawdzeń jakości obrazu:
1. Analiza jasności i kontrastu
2. Wykrywanie rozmycia
3. Wykrywanie obecności tekstu
4. Ocena poziomu szumu w obrazie

### Spodziewane Korzyści
- Lepsza dokładność OCR
- Zmniejszenie kosztów nieudanych prób
- Natychmiastowa informacja zwrotna dla użytkowników
- Wyższa jakość fiszek

## Optymalizacja Obrazów
### Problem
Duże lub niezoptymalizowane obrazy:
- Zwiększają koszty API (większa liczba tokenów)
- Spowalniają przetwarzanie
- Zużywają więcej przepustowości
- Niekoniecznie poprawiają jakość OCR

### Proponowane Rozwiązanie
Implementacja inteligentnego przetwarzania wstępnego:
1. Automatyczna kompresja z zachowaniem jakości
2. Inteligentne przycinanie w celu usunięcia niepotrzebnych marginesów
3. Poprawa kontrastu dla tekstu
4. Konwersja formatu na optymalny dla OCR

### Spodziewane Korzyści
- Zmniejszenie kosztów API
- Szybsze przetwarzanie
- Lepsze wyniki OCR
- Mniejsze zużycie przepustowości

## Priorytetyzacja Wdrożenia
1. Mechanizm Cache'owania (Wysoki Wpływ/Średni Nakład)
2. Monitorowanie API (Średni Wpływ/Niski Nakład)
3. Optymalizacja Obrazów (Wysoki Wpływ/Niski Nakład)
4. Walidacja Jakości Obrazu (Średni Wpływ/Wysoki Nakład)

Te ulepszenia powinny zostać wdrożone po ustabilizowaniu podstawowej funkcjonalności i zwalidowaniu podstawowych przypadków użycia. 