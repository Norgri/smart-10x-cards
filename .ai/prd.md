# Dokument wymagań produktu (PRD) - Smart 10x Cards

## 1. Przegląd produktu

Ta aplikacja internetowa ma na celu uproszczenie tworzenia wysokiej jakości edukacyjnych fiszek przy użyciu AI. Produkt umożliwia użytkownikom generowanie fiszek z obrazów stron anglojęzycznych książek, edytowanie ich treści, zarządzanie tagami oraz integrację fiszek z istniejącym algorytmem powtórzeń w odstępach czasowych. Głównym celem jest skrócenie czasu potrzebnego na stworzenie efektywnych fiszek oraz zachęcenie użytkowników do korzystania z metody nauki opartej na powtarzaniu w odstępach czasowych.

## 2. Problem użytkownika

Użytkownicy ręcznie tworzą fiszki, co jest procesem bardzo czasochłonnym i zniechęca ich do korzystania z efektywnej metody powtarzania w odstępach czasowych. Co więcej, brak intuicyjnego narzędzia do generowania, edytowania i organizowania fiszek utrudnia regularne stosowanie tej metody nauki.

## 3. Wymagania funkcjonalne

- Generuj fiszki przy użyciu sztucznej inteligencji na podstawie obrazu strony książki w języku angielskim.
- Udostępniaj podgląd wygenerowanych fiszek w celu weryfikacji użytkownika przed zaakceptowaniem.
- Umożliwiaj edycję fiszek, w tym modyfikację pól „przód” i „tył”, z których każde jest ograniczone do 500 znaków.
- Automatycznie generuj do 4 tagów dla każdej fiszki, z opcją edycji przez użytkownika.
- Umożliwiaj użytkownikom ponowne generowanie fiszek bez konieczności akceptowania początkowo wygenerowanych.
- Implementuj prosty system kont użytkowników, który obsługuje rejestrację, logowanie, edycję hasła i usuwanie konta.
- Zintegruj wygenerowane fiszki z zewnętrznym algorytmem powtarzania w odstępach (sam algorytm odstępów nie jest zaimplementowany w MVP).
- Obsługuj błędy przetwarzania obrazu (problemy z OCR) poprzez wyświetlanie użytkownikowi jasnego, prostego komunikatu o błędzie.

## 4. Granice produktu

- Zaawansowane algorytmy powtarzania w odstępach (np. SuperMemo, Anki) nie są zaimplementowane w MVP.
- Importowanie wielu formatów plików (takich jak PDF, DOCX itp.) jest poza zakresem — obsługiwane jest tylko przetwarzanie obrazów.
- Funkcjonalność udostępniania zestawów fiszek między użytkownikami nie jest uwzględniona.
- Nie planuje się integracji z zewnętrznymi platformami edukacyjnymi dla MVP.
- Aplikacje mobilne nie są objęte zakresem; produkt będzie dostępny wyłącznie jako aplikacja internetowa.
- Optymalizacja kosztów przetwarzania obrazów opartego na sztucznej inteligencji zostanie omówiona w iteracjach po MVP.

## 5. Historyjki użytkowników

### US-001: Rejestracja, logowanie i zarządzanie kontem
Opis: Jako nowy użytkownik chcę móc zarejestrować konto, a następnie zalogować się, aby mieć dostęp do swoich fiszek. Użytkownicy powinni mieć również możliwość edycji hasła oraz usunięcia konta.
Kryteria akceptacji:
- Użytkownik może utworzyć konto poprzez wypełnienie formularza rejestracyjnego.
- Użytkownik może zalogować się przy użyciu stworzonych danych.
- Użytkownik może edytować swoje hasło w ustawieniach konta.
- Użytkownik może usunąć swoje konto, co powoduje usunięcie wszystkich powiązanych danych.

### US-002: Generowanie fiszek przez AI
Opis: Jako użytkownik chcę generować fiszki na podstawie zdjęcia strony z książki, aby szybko uzyskać wysokiej jakości fiszki do nauki języka angielskiego.
Kryteria akceptacji:
- Użytkownik przesyła zdjęcie strony książki.
- System generuje fiszki z wypełnionymi polami "przód" i "tył" (każde do 500 znaków).
- System automatycznie generuje do 4 tagów, które mogą być później edytowane przez użytkownika.
- Użytkownik otrzymuje wizualny podgląd fiszek przed ich ostateczną akceptacją.

### US-003: Przeglądanie, edycja i usuwanie fiszek
Opis: Jako użytkownik chcę móc przeglądać, edytować i usuwać wygenerowane fiszki, aby móc je dostosować do własnych potrzeb.
Kryteria akceptacji:
- Użytkownik ma dostęp do listy swoich fiszek.
- Użytkownik może edytować treść fiszek, w tym pola "przód", "tył" oraz tagi.
- Użytkownik może usuwać fiszki, które nie spełniają jego oczekiwań.

### US-004: Weryfikacja i ponowne generowanie fiszek
Opis: Jako użytkownik chcę móc ręcznie weryfikować jakość wygenerowanych fiszek oraz ponawiać generowanie, jeśli poprzednie nie spełniają moich oczekiwań.
Kryteria akceptacji:
- Po wygenerowaniu fiszek, użytkownik widzi opcję akceptacji lub odrzucenia fiszek.
- W przypadku odrzucenia, użytkownik może zainicjować ponowną generację nowych fiszek.
- Podgląd fiszek umożliwia dokładną weryfikację treści przed ostatecznym zatwierdzeniem.

### US-005: Obsługa błędów OCR
Opis: Jako użytkownik chcę otrzymywać jasne i proste komunikaty o błędach, gdy wystąpią problemy z przetwarzaniem obrazu (OCR), aby wiedzieć, że wystąpił problem i podjąć odpowiednie kroki.
Kryteria akceptacji:
- W przypadku wystąpienia błędu OCR, system wyświetla czytelny komunikat o błędzie.
- Komunikat wyjaśnia możliwe przyczyny oraz sugeruje działania, takie jak ponowne przesłanie zdjęcia.

### US-006: Bezpieczne logowanie i ochrona danych
Opis: Jako użytkownik chcę, aby proces logowania był bezpieczny, a moje dane odpowiednio chronione, co daje mi pewność, że informacje o moich fiszkach i koncie są zabezpieczone.
Kryteria akceptacji:
- Proces logowania wykorzystuje bezpieczne mechanizmy autoryzacji.
- Dane użytkownika są przechowywane zgodnie z najlepszymi praktykami bezpieczeństwa.
- Dostęp do konta jest możliwy tylko po poprawnej autentykacji.

## 6. Metryki sukcesu

- Co najmniej 75% fiszek generowanych przez AI musi być akceptowanych przez użytkowników.
- Użytkownicy powinni tworzyć co najmniej 75% fiszek z wykorzystaniem automatycznego generowania przez AI.
- Wysoki współczynnik ponownego użycia funkcji generowania fiszek.
- Niski wskaźnik błędów OCR, a w przypadku ich wystąpienia, użytkownik otrzymuje prosty i jasny komunikat o błędzie.
- Pozytywne opinie użytkowników dotyczące intuicyjności interfejsu edycji i łatwości obsługi systemu. 