Jesteś doświadczonym menedżerem produktu, którego zadaniem jest stworzenie kompleksowego dokumentu wymagań produktu (PRD) w oparciu o poniższe opisy:

<project_description>
### Główny problem
Manualne tworzenie wysokiej jakości fiszek edukacyjnych jest czasochłonne, co zniechęca do korzystania z efektywnej metody nauki jaką jest spaced repetition.

### Najmniejszy zestaw funkcjonalności
- Generowanie fiszek przez AI na podstawie zdjęcia strony z książki do angielskiego
- Manualne tworzenie fiszek
- Przeglądanie, edycja i usuwanie fiszek
- Wyszukiwanie fiszek na podstawie tagów np. rozdział książki, temat
- Prosty system kont użytkowników do przechowywania fiszek


### Co NIE wchodzi w zakres MVP
- Integracja fiszek z gotowym algorytmem powtórek
- Własny, zaawansowany algorytm powtórek (jak SuperMemo, Anki)
- Import wielu formatów (PDF, DOCX, itp.)
- Współdzielenie zestawów fiszek między użytkownikami
- Integracje z innymi platformami edukacyjnymi
- Aplikacje mobilne (na początek tylko web)

### Kryteria sukcesu
- 75% fiszek wygenerowanych przez AI jest akceptowane przez użytkownika
- Użytkownicy tworzą 75% fiszek z wykorzystaniem AI
</project_description>

<project_details>

Jasne, oto podsumowanie naszej rozmowy dotyczące planowania PRD dla MVP aplikacji do generowania fiszek.

<conversation_summary>
<decisions>
1.  **Docelowy użytkownik:** 10-latek korzystający z podręcznika do angielskiego.
2.  **Problem:** Manualne przepisywanie treści z podręcznika do fiszek jest czasochłonne.
3.  **Format fiszek AI:** Słowo-definicja (słowo/fraza, opcjonalny zapis fonetyczny, polskie tłumaczenie), na wzór podsumowań rozdziałów w książce.
4.  **Generowanie AI:** Z jednego zdjęcia strony powtórkowej z książki. Obsługa błędów AI polega na manualnej weryfikacji przez użytkownika i możliwości ponownego generowania. Brak przechowywania zdjęć w MVP.
5.  **Jakość AI:** Weryfikacja przez użytkownika za pomocą przycisków "Akceptuj", "Edytuj", "Usuń". Logi akcji zapisywane w bazie do mierzenia kryteriów sukcesu.
6.  **Tagi:** Generowane przez AI (na podstawie promptu systemowego), edytowalne przez użytkownika (max 4 na fiszkę). Służą do wyszukiwania.
7.  **Tworzenie manualne:** Pola takie same jak dla fiszek AI (przód - słowo/fraza, tył - tłumaczenie, opcjonalnie zapis fonetyczny, tagi).
8.  **Zarządzanie fiszkami:** Edycja, usuwanie, dodawanie pojedynczych fiszek. Brak operacji zbiorczych w MVP.
9.  **Konta użytkowników:** Proste, oparte na emailu i haśle. Bez integracji z zewnętrznymi dostawcami. Dane zabezpieczone zgodnie z najlepszymi praktykami.
10. **Model AI:** Wykorzystanie OpenRouter, model wybierany na bieżąco, konfiguracja z poziomu aplikacji (nie dla użytkownika końcowego w MVP).
11. **Obsługa zdjęć:** Zakładane idealne warunki (czysta strona z podręcznika).
12. **Kontekst książki:** Brak przechowywania informacji o książce; kontekst definiowany przez tagi.
13. **Przepływ generowania AI:** Przesłanie zdjęcia i wyświetlenie wygenerowanych fiszek na tej samej stronie. Akceptacja/edycja/usunięcie odbywa się w tym samym widoku.
14. **Zapis fonetyczny:** Pole opcjonalne w fiszkach.
15. **Interfejs:** Strona dedykowana do generowania (pole uploadu, przycisk generacji). Edycja fiszki: pola tekstowe, pole "chips array" dla tagów, przyciski "Akceptuj"/"Anuluj".
16. **Obsługa błędów:** Prosty komunikat dla użytkownika, szczegóły zapisywane w logach systemowych.
</decisions>

<matched_recommendations>
1.  **Makiety/Prototypy:** Stworzenie szczegółowych makiet lub prostych prototypów klikalnych dla kluczowych przepływów (przesyłanie zdjęcia, akceptacja/edycja/usuwanie, lista fiszek z wyszukiwaniem, tworzenie/edycja manualna). Jest to kluczowe, biorąc pod uwagę decyzję o interakcji na jednym widoku.
2.  **Schemat bazy danych:** Opracowanie schematu (users, flashcards, tags, flashcard_tags, logs dla akcji AI).
3.  **Strategia zapisu fonetycznego:** Potwierdzono, że pole jest opcjonalne. Należy to uwzględnić w UI i bazie danych.
4.  **Analiza kosztów AI:** Przeprowadzenie wstępnej analizy kosztów OpenRouter.
5.  **Komunikaty błędów:** Zdefiniowanie konkretnych komunikatów dla użytkownika i logów systemowych.
6.  **Bezpieczeństwo kont:** Zaplanowanie podstawowych mechanizmów (walidacja, hashowanie haseł).
7.  **Ryzyka projektowe:** Identyfikacja ryzyk (jakość AI, OCR, koszty) i plany mitygacji.
8.  **Persony i User Flow:** Chociaż nie wymienione explicite w ostatnich odpowiedziach, stworzenie persony (10-latek) i diagramów przepływu (potwierdzonych w decyzjach) pozostaje kluczowe dla dobrego PRD.
</matched_recommendations>

<prd_planning_summary>
**a. Główne wymagania funkcjonalne produktu:**
*   System kont użytkowników (rejestracja/logowanie email+hasło).
*   Możliwość przesłania zdjęcia pojedynczej strony z książki do angielskiego.
*   Generowanie fiszek (słowo/fraza, opcjonalny zapis fonetyczny, tłumaczenie PL) przez AI (OpenRouter) na podstawie zdjęcia.
*   Automatyczne generowanie tagów przez AI na podstawie promptu systemowego.
*   Interfejs do przeglądania, akceptowania, edytowania (treść + tagi) i usuwania fiszek wygenerowanych przez AI na tym samym widoku co generacja.
*   Możliwość manualnego tworzenia fiszek z takimi samymi polami (przód, tył, fonetyka, tagi).
*   Przeglądanie wszystkich fiszek użytkownika.
*   Wyszukiwanie fiszek po tagach.
*   Logowanie akcji (akceptacja, edycja, usunięcie) dla fiszek AI w celu pomiaru sukcesu.

**b. Kluczowe historie użytkownika i ścieżki korzystania:**
*   *Jako uczeń (10 lat), chcę móc zrobić zdjęcie strony powtórkowej z mojej książki do angielskiego i automatycznie otrzymać zestaw fiszek (słowo-tłumaczenie), abym mógł szybciej przygotować się do nauki.*
*   *Jako użytkownik, chcę przejrzeć fiszki wygenerowane przez AI i móc je zaakceptować, edytować (poprawić błędy lub zmienić tagi) lub usunąć te niepoprawne/niechciane, aby mieć pewność co do jakości moich materiałów.*
*   *Jako użytkownik, chcę móc ręcznie dodać własną fiszkę (np. słówko zasłyszane gdzie indziej), aby uzupełnić moją bazę wiedzy.*
*   *Jako użytkownik, chcę móc wyszukać fiszki po tagach (np. "Rozdział 3"), aby łatwo znaleźć materiał do konkretnej powtórki.*
*   *Jako użytkownik, chcę mieć własne konto, aby moje fiszki były bezpieczne i dostępne tylko dla mnie.*

**c. Ważne kryteria sukcesu i sposoby ich mierzenia:**
*   **Kryterium 1:** 75% fiszek wygenerowanych przez AI jest akceptowane przez użytkownika.
    *   **Pomiar:** Logowanie akcji "Akceptuj", "Edytuj", "Usuń" dla każdej fiszki AI. Obliczenie stosunku liczby zaakceptowanych fiszek do sumy fiszek edytowanych i usuniętych (lub do wszystkich wygenerowanych minus te bez akcji) po każdej sesji generowania.
*   **Kryterium 2:** Użytkownicy tworzą 75% fiszek z wykorzystaniem AI.
    *   **Pomiar:** Logowanie źródła utworzenia fiszki (AI vs Manual). Obliczenie stosunku liczby fiszek stworzonych przez AI do całkowitej liczby fiszek w systemie (lub stworzonych w danym okresie).

**d. Wszelkie nierozwiązane kwestie lub obszary wymagające dalszego wyjaśnienia:**
*   (brak - na podstawie dostarczonych odpowiedzi wszystkie kluczowe kwestie dla MVP zostały wyjaśnione)
</prd_planning_summary>

<unresolved_issues>
*   Wybór konkretnego modelu AI w OpenRouter i optymalizacja promptu systemowego do generowania tagów wymagają dalszych testów.
*   Szczegółowy projekt interfejsu użytkownika (makiety/prototypy) jest kolejnym krokiem.
*   Dokładna implementacja logowania metryk sukcesu w bazie danych.
*   Analiza kosztów użycia API OpenRouter.
</unresolved_issues>
</conversation_summary>

</project_details>

Wykonaj następujące kroki, aby stworzyć kompleksowy i dobrze zorganizowany dokument:

1. Podziel PRD na następujące sekcje:
   a. Przegląd projektu
   b. Problem użytkownika
   c. Wymagania funkcjonalne
   d. Granice projektu
   e. Historie użytkownika
   f. Metryki sukcesu

2. W każdej sekcji należy podać szczegółowe i istotne informacje w oparciu o opis projektu i odpowiedzi na pytania wyjaśniające. Upewnij się, że:
   - Używasz jasnego i zwięzłego języka
   - W razie potrzeby podajesz konkretne szczegóły i dane
   - Zachowujesz spójność w całym dokumencie
   - Odnosisz się do wszystkich punktów wymienionych w każdej sekcji

3. Podczas tworzenia historyjek użytkownika i kryteriów akceptacji
   - Wymień WSZYSTKIE niezbędne historyjki użytkownika, w tym scenariusze podstawowe, alternatywne i skrajne.
   - Przypisz unikalny identyfikator wymagań (np. US-001) do każdej historyjki użytkownika w celu bezpośredniej identyfikowalności.
   - Uwzględnij co najmniej jedną historię użytkownika specjalnie dla bezpiecznego dostępu lub uwierzytelniania, jeśli aplikacja wymaga identyfikacji użytkownika lub ograniczeń dostępu.
   - Upewnij się, że żadna potencjalna interakcja użytkownika nie została pominięta.
   - Upewnij się, że każda historia użytkownika jest testowalna.

Użyj następującej struktury dla każdej historii użytkownika:
- ID
- Tytuł
- Opis
- Kryteria akceptacji

4. Po ukończeniu PRD przejrzyj go pod kątem tej listy kontrolnej:
   - Czy każdą historię użytkownika można przetestować?
   - Czy kryteria akceptacji są jasne i konkretne?
   - Czy mamy wystarczająco dużo historyjek użytkownika, aby zbudować w pełni funkcjonalną aplikację?
   - Czy uwzględniliśmy wymagania dotyczące uwierzytelniania i autoryzacji (jeśli dotyczy)?

5. Formatowanie PRD:
   - Zachowaj spójne formatowanie i numerację.
   - Nie używaj pogrubionego formatowania w markdown ( ** ).
   - Wymień WSZYSTKIE historyjki użytkownika.
   - Sformatuj PRD w poprawnym markdown.

Przygotuj PRD z następującą strukturą:

```markdown
# Dokument wymagań produktu (PRD) - {{app-name}}
## 1. Przegląd produktu
## 2. Problem użytkownika
## 3. Wymagania funkcjonalne
## 4. Granice produktu
## 5. Historyjki użytkowników
## 6. Metryki sukcesu
```

Pamiętaj, aby wypełnić każdą sekcję szczegółowymi, istotnymi informacjami w oparciu o opis projektu i nasze pytania wyjaśniające. Upewnij się, że PRD jest wyczerpujący, jasny i zawiera wszystkie istotne informacje potrzebne do dalszej pracy nad produktem.

Ostateczny wynik powinien składać się wyłącznie z PRD zgodnego ze wskazanym formatem w markdown, który zapiszesz w pliku .ai/prd.md