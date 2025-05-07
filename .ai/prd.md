# Dokument wymagań produktu (PRD) - Smart 10x Cards

## 1. Przegląd produktu

Smart 10x Cards to aplikacja internetowa zaprojektowana, aby zautomatyzować i uprościć proces tworzenia fiszek edukacyjnych. Głównym celem jest pomoc użytkownikom, zwłaszcza młodym uczniom (docelowo 10-latkom uczącym się angielskiego), w szybkim generowaniu wysokiej jakości fiszek na podstawie zdjęć stron z podręczników. Aplikacja wykorzystuje sztuczną inteligencję (AI) do ekstrakcji kluczowych informacji (słowo/fraza, opcjonalny zapis fonetyczny, tłumaczenie) i tagów, minimalizując czasochłonność manualnego przepisywania. Użytkownicy mogą również tworzyć, edytować, usuwać i wyszukiwać fiszki manualnie. MVP koncentruje się na podstawowej funkcjonalności generowania i zarządzania fiszkami w ramach indywidualnych kont użytkowników.

## 2. Problem użytkownika

Manualne tworzenie fiszek edukacyjnych, szczególnie poprzez przepisywanie treści z podręczników szkolnych, jest procesem czasochłonnym i monotonnym. Zniechęca to uczniów do regularnego korzystania z fiszek, które są uznawane za efektywną metodę nauki (np. w połączeniu ze spaced repetition). Brak szybkiego sposobu na konwersję materiału z książki na cyfrowe fiszki stanowi barierę w nauce, zwłaszcza dla młodszych użytkowników.

## 3. Wymagania funkcjonalne

Aplikacja w wersji MVP będzie posiadać następujące funkcjonalności:

*   FR-001: System kont użytkowników: Rejestracja i logowanie za pomocą adresu e-mail i hasła.
*   FR-002: Przesyłanie zdjęcia: Możliwość przesłania pojedynczego zdjęcia strony (np. powtórkowej) z podręcznika do języka angielskiego. Założenie dobrych warunków oświetleniowych i jakości zdjęcia.
*   FR-003: Generowanie fiszek przez AI: Automatyczne tworzenie fiszek na podstawie przesłanego zdjęcia z wykorzystaniem modelu AI (przez OpenRouter). Fiszka zawierać będzie słowo/frazę (przód), polskie tłumaczenie (tył) oraz opcjonalnie zapis fonetyczny.
*   FR-004: Generowanie tagów przez AI: Automatyczne sugerowanie tagów dla wygenerowanych fiszek na podstawie promptu systemowego (np. temat, numer rozdziału).
*   FR-005: Weryfikacja i edycja fiszek AI: Interfejs umożliwiający użytkownikowi przegląd wygenerowanych fiszek na tym samym widoku, co ich generacja. Użytkownik może zaakceptować, edytować (treść fiszki oraz tagi - max 4 na fiszkę) lub usunąć każdą fiszkę.
*   FR-006: Manualne tworzenie fiszek: Możliwość ręcznego dodawania fiszek z polami: słowo/fraza, tłumaczenie, opcjonalny zapis fonetyczny, tagi (max 4).
*   FR-007: Przeglądanie fiszek: Widok listy wszystkich zapisanych fiszek użytkownika.
*   FR-008: Wyszukiwanie fiszek: Możliwość filtrowania/wyszukiwania fiszek na liście na podstawie przypisanych tagów.
*   FR-009: Logowanie akcji AI: Zapisywanie w bazie danych akcji użytkownika (akceptacja, edycja, usunięcie) dla fiszek wygenerowanych przez AI w celu mierzenia kryteriów sukcesu.
*   FR-010: Logowanie źródła fiszki: Zapisywanie informacji, czy fiszka została stworzona manualnie, czy przez AI.

## 4. Granice produktu

Następujące funkcje i cechy NIE wchodzą w zakres MVP:

*   Integracja z algorytmami powtórek (Spaced Repetition Systems, SRS).
*   Implementacja własnego, zaawansowanego algorytmu SRS (jak w SuperMemo czy Anki).
*   Import fiszek z plików w innych formatach (np. PDF, DOCX, CSV).
*   Funkcje społecznościowe, takie jak współdzielenie zestawów fiszek między użytkownikami.
*   Integracje z zewnętrznymi platformami edukacyjnymi (np. Google Classroom, Moodle).
*   Dedykowane aplikacje mobilne (iOS, Android) - dostępna będzie tylko wersja webowa.
*   Przechowywanie przesłanych przez użytkowników zdjęć po zakończeniu procesu generowania fiszek.
*   Możliwość wykonywania operacji zbiorczych na fiszkach (np. masowe usuwanie, edycja tagów dla wielu fiszek naraz).
*   Integracja z zewnętrznymi dostawcami tożsamości (np. logowanie przez Google, Facebook).
*   Możliwość konfiguracji modelu AI przez użytkownika końcowego.
*   Zaawansowana obsługa zdjęć wykonanych w trudnych warunkach (np. słabe oświetlenie, zagięte strony, pismo odręczne).
*   Jawne przechowywanie metadanych dotyczących podręcznika (kontekst definiowany jest wyłącznie przez tagi).

## 5. Historyjki użytkowników

Poniżej znajdują się historyjki użytkowników opisujące interakcje z aplikacją:

---

*   ID: US-001
*   Tytuł: Rejestracja nowego użytkownika
*   Opis: Jako nowy użytkownik, chcę móc założyć konto w aplikacji używając mojego adresu e-mail i hasła, aby móc zapisywać i zarządzać moimi fiszkami.
*   Kryteria akceptacji:
    *   Formularz rejestracji zawiera pola na adres e-mail, hasło i potwierdzenie hasła.
    *   Walidacja poprawności adresu e-mail jest przeprowadzana po stronie klienta i serwera.
    *   Wymagania dotyczące siły hasła są zdefiniowane i egzekwowane (np. minimalna długość).
    *   Hasła są bezpiecznie hashowane przed zapisaniem w bazie danych.
    *   Użytkownik otrzymuje potwierdzenie pomyślnej rejestracji i może się zalogować.
    *   W przypadku błędu (np. zajęty e-mail) wyświetlany jest zrozumiały komunikat.

---

*   ID: US-002
*   Tytuł: Logowanie do aplikacji
*   Opis: Jako zarejestrowany użytkownik, chcę móc zalogować się do aplikacji używając mojego adresu e-mail i hasła, aby uzyskać dostęp do moich fiszek.
*   Kryteria akceptacji:
    *   Formularz logowania zawiera pola na adres e-mail i hasło.
    *   Po poprawnym wprowadzeniu danych użytkownik jest zalogowany i przekierowany do panelu głównego.
    *   W przypadku błędnych danych (nieprawidłowy e-mail lub hasło) wyświetlany jest odpowiedni komunikat.
    *   Sesja użytkownika jest zarządzana bezpiecznie.

---

*   ID: US-003
*   Tytuł: Przesyłanie zdjęcia strony podręcznika
*   Opis: Jako zalogowany użytkownik, chcę móc przesłać zdjęcie pojedynczej strony z mojego podręcznika do angielskiego, aby system mógł wygenerować z niej fiszki.
*   Kryteria akceptacji:
    *   Na dedykowanej stronie znajduje się przycisk/pole do przesłania pliku graficznego (np. JPG, PNG).
    *   Istnieje limit rozmiaru przesyłanego pliku.
    *   Użytkownik widzi postęp przesyłania pliku (opcjonalnie).
    *   Po pomyślnym przesłaniu pliku inicjowany jest proces generowania fiszek.
    *   W przypadku błędu przesyłania (np. zły format, za duży plik) wyświetlany jest komunikat.
    *   Interfejs informuje, że należy przesłać zdjęcie pojedynczej strony.

---

*   ID: US-004
*   Tytuł: Generowanie fiszek przez AI ze zdjęcia
*   Opis: Jako zalogowany użytkownik, po przesłaniu zdjęcia strony, chcę, aby system automatycznie wygenerował fiszki (słowo/fraza, tłumaczenie PL, opcjonalnie fonetyka) oraz powiązane tagi, abym nie musiał przepisywać ich ręcznie.
*   Kryteria akceptacji:
    *   Proces generowania jest inicjowany automatycznie po przesłaniu zdjęcia.
    *   Użytkownik jest informowany o trwającym procesie generowania (np. wskaźnik ładowania).
    *   Wygenerowane fiszki (przód, tył, fonetyka) i tagi są prezentowane na tym samym widoku.
    *   System wykorzystuje skonfigurowany model AI przez OpenRouter do ekstrakcji danych i generowania tagów.
    *   Format wygenerowanych fiszek to słowo/fraza, opcjonalny zapis fonetyczny, polskie tłumaczenie.
    *   Generowane są tagi na podstawie promptu systemowego.

---

*   ID: US-005
*   Tytuł: Przeglądanie wygenerowanych fiszek AI
*   Opis: Jako zalogowany użytkownik, chcę móc przejrzeć listę fiszek wygenerowanych przez AI bezpośrednio po ich utworzeniu, aby ocenić ich poprawność i zdecydować co dalej.
*   Kryteria akceptacji:
    *   Wygenerowane fiszki są wyświetlane w formie listy lub kart na tym samym widoku, co pole przesyłania zdjęcia.
    *   Każda fiszka pokazuje wygenerowaną treść (przód, tył, fonetyka) oraz tagi.
    *   Przy każdej fiszce znajdują się przyciski akcji: "Akceptuj", "Edytuj", "Usuń".

---

*   ID: US-006
*   Tytuł: Akceptacja fiszki wygenerowanej przez AI
*   Opis: Jako zalogowany użytkownik, przeglądając wygenerowane fiszki, chcę móc oznaczyć poprawną fiszkę jako "zaakceptowaną", aby została ona zapisana na moim koncie i aby system wiedział, że AI zadziałało poprawnie.
*   Kryteria akceptacji:
    *   Kliknięcie przycisku "Akceptuj" przy fiszce powoduje jej zapisanie w bazie danych użytkownika.
    *   Akcja "Akceptuj" jest logowana w systemie do celów analitycznych (metryki sukcesu).
    *   Zaakceptowana fiszka wizualnie zmienia swój stan lub znika z listy "do weryfikacji" (do ustalenia w projekcie UI).

---

*   ID: US-007
*   Tytuł: Edycja fiszki wygenerowanej przez AI
*   Opis: Jako zalogowany użytkownik, przeglądając wygenerowane fiszki, chcę móc edytować treść (przód, tył, fonetyka) oraz tagi (dodawać, usuwać - max 4) niepoprawnej lub niekompletnej fiszki, aby poprawić jej jakość przed zapisaniem.
*   Kryteria akceptacji:
    *   Kliknięcie przycisku "Edytuj" otwiera formularz edycji danej fiszki.
    *   Formularz zawiera edytowalne pola dla przodu, tyłu, zapisu fonetycznego i tagów.
    *   Interfejs do zarządzania tagami pozwala na dodawanie i usuwanie tagów (np. "chips array").
    *   Maksymalnie 4 tagi mogą być przypisane do fiszki.
    *   Po zapisaniu zmian fiszka jest zapisywana/aktualizowana w bazie danych użytkownika.
    *   Akcja "Edytuj" (rozumiana jako zapisanie po edycji) jest logowana w systemie do celów analitycznych.
    *   Edytowana fiszka wizualnie zmienia swój stan lub znika z listy "do weryfikacji".

---

*   ID: US-008
*   Tytuł: Usuwanie fiszki wygenerowanej przez AI
*   Opis: Jako zalogowany użytkownik, przeglądając wygenerowane fiszki, chcę móc usunąć błędną lub niepotrzebną fiszkę, aby nie zaśmiecała mojej bazy wiedzy.
*   Kryteria akceptacji:
    *   Kliknięcie przycisku "Usuń" przy fiszce powoduje jej permanentne usunięcie (lub oznaczenie jako usunięta) z listy do weryfikacji.
    *   Akcja "Usuń" jest logowana w systemie do celów analitycznych.
    *   Usunięta fiszka znika z widoku.
    *   System może wymagać potwierdzenia usunięcia (opcjonalnie).

---

*   ID: US-009
*   Tytuł: Tworzenie manualne nowej fiszki
*   Opis: Jako zalogowany użytkownik, chcę móc ręcznie dodać nową fiszkę (np. słówko zasłyszane poza podręcznikiem), podając jej treść (przód, tył, opcjonalnie fonetyka) i tagi, aby uzupełnić moją kolekcję.
*   Kryteria akceptacji:
    *   Dostępny jest dedykowany przycisk/sekcja do tworzenia nowej fiszki.
    *   Formularz tworzenia zawiera pola na przód (słowo/fraza), tył (tłumaczenie), opcjonalny zapis fonetyczny i tagi.
    *   Walidacja zapewnia, że wymagane pola (np. przód, tył) są wypełnione.
    *   Interfejs do zarządzania tagami pozwala na dodawanie i usuwanie tagów (max 4).
    *   Po zapisaniu fiszka jest dodawana do bazy danych użytkownika.
    *   Źródło fiszki jest oznaczane jako "manualne".

---

*   ID: US-010
*   Tytuł: Przeglądanie wszystkich zapisanych fiszek
*   Opis: Jako zalogowany użytkownik, chcę mieć dostęp do widoku listy wszystkich moich zapisanych fiszek (zarówno tych zaakceptowanych z AI, jak i stworzonych manualnie), aby móc je przeglądać i zarządzać nimi.
*   Kryteria akceptacji:
    *   Istnieje dedykowana strona/sekcja wyświetlająca wszystkie fiszki użytkownika.
    *   Fiszki są prezentowane w czytelny sposób (np. lista, karty), pokazując kluczowe informacje (przód, tył).
    *   Przy każdej fiszce dostępne są opcje edycji i usunięcia (dla fiszek manualnych i zaakceptowanych/edytowanych AI).
    *   Widok może zawierać paginację, jeśli liczba fiszek jest duża.

---

*   ID: US-011
*   Tytuł: Wyszukiwanie fiszek po tagach
*   Opis: Jako zalogowany użytkownik, przeglądając listę wszystkich moich fiszek, chcę móc wyszukać/filtrować fiszki na podstawie przypisanych tagów (np. "Rozdział 3", "Czasowniki nieregularne"), aby szybko znaleźć materiał do konkretnej powtórki.
*   Kryteria akceptacji:
    *   W widoku listy fiszek znajduje się pole wyszukiwania/filtrowania tagów.
    *   Użytkownik może wybrać jeden lub więcej tagów jako kryterium wyszukiwania.
    *   Lista fiszek jest dynamicznie aktualizowana, aby pokazać tylko te fiszki, które pasują do wybranych tagów.
    *   Możliwe jest łatwe usunięcie filtrów i powrót do pełnej listy.

---

*   ID: US-012
*   Tytuł: Edycja istniejącej fiszki (manualnej lub zaakceptowanej/edytowanej AI)
*   Opis: Jako zalogowany użytkownik, przeglądając listę wszystkich moich fiszek, chcę móc edytować treść i tagi istniejącej fiszki, aby poprawić błędy lub zaktualizować informacje.
*   Kryteria akceptacji:
    *   W widoku listy fiszek przy każdej fiszce znajduje się przycisk "Edytuj".
    *   Kliknięcie "Edytuj" otwiera formularz z załadowanymi danymi fiszki (przód, tył, fonetyka, tagi).
    *   Użytkownik może modyfikować wszystkie pola i tagi (max 4).
    *   Po zapisaniu zmian dane fiszki w bazie danych są aktualizowane.

---

*   ID: US-013
*   Tytuł: Usuwanie istniejącej fiszki (manualnej lub zaakceptowanej/edytowanej AI)
*   Opis: Jako zalogowany użytkownik, przeglądając listę wszystkich moich fiszek, chcę móc usunąć niepotrzebną już fiszkę, aby utrzymać porządek w mojej kolekcji.
*   Kryteria akceptacji:
    *   W widoku listy fiszek przy każdej fiszce znajduje się przycisk "Usuń".
    *   Kliknięcie "Usuń" powoduje permanentne usunięcie fiszki z bazy danych użytkownika.
    *   System może wymagać potwierdzenia usunięcia.
    *   Usunięta fiszka znika z listy.

---

*   ID: US-014
*   Tytuł: Obsługa błędów generowania AI
*   Opis: Jako zalogowany użytkownik, w przypadku gdy AI nie jest w stanie przetworzyć zdjęcia lub zwraca błąd, chcę otrzymać czytelny komunikat o problemie, abym wiedział, co się stało i co mogę zrobić dalej (np. spróbować ponownie, przesłać inne zdjęcie).
*   Kryteria akceptacji:
    *   W przypadku niepowodzenia procesu generowania AI (np. błąd API, nieczytelne zdjęcie dla OCR/AI) użytkownik widzi prosty, zrozumiały komunikat na interfejsie.
    *   Komunikat informuje o niepowodzeniu i sugeruje możliwe kroki (np. "Nie udało się wygenerować fiszek. Spróbuj ponownie lub użyj innego zdjęcia.").
    *   Szczegółowe informacje o błędzie są logowane w systemie dla deweloperów.
    *   Użytkownik nie jest blokowany i może ponowić próbę lub wykonać inne akcje.

---

*   ID: US-015
*   Tytuł: Obsługa błędów przesyłania zdjęcia
*   Opis: Jako użytkownik, w przypadku problemu podczas przesyłania zdjęcia (np. zły format pliku, przekroczony limit rozmiaru, problem z połączeniem), chcę otrzymać informację o błędzie, abym mógł go naprawić i spróbować ponownie.
*   Kryteria akceptacji:
    *   System sprawdza format i rozmiar pliku przed lub w trakcie przesyłania.
    *   Jeśli plik jest nieprawidłowy (format, rozmiar), przesyłanie jest blokowane, a użytkownik widzi komunikat o błędzie.
    *   W przypadku przerwania połączenia podczas przesyłania, użytkownik otrzymuje stosowny komunikat.
    *   Komunikat jasno wskazuje przyczynę błędu (np. "Niedozwolony format pliku. Akceptowane formaty: JPG, PNG.", "Plik jest za duży. Maksymalny rozmiar: X MB.").

---

*   ID: US-016
*   Tytuł: Opcjonalny zapis fonetyczny
*   Opis: Jako użytkownik, podczas tworzenia lub edytowania fiszki (zarówno AI jak i manualnie), chcę mieć możliwość dodania lub pominięcia zapisu fonetycznego, ponieważ nie zawsze jest on potrzebny lub dostępny.
*   Kryteria akceptacji:
    *   Pole "Zapis fonetyczny" w formularzach tworzenia i edycji fiszki jest opcjonalne.
    *   System poprawnie zapisuje fiszkę niezależnie od tego, czy pole fonetyczne jest wypełnione, czy puste.
    *   Wyświetlanie fiszki poprawnie obsługuje brak zapisu fonetycznego (np. nie wyświetla pustego pola lub etykiety).
    *   AI podczas generowania może, ale nie musi, wypełniać to pole - jego brak nie jest traktowany jako błąd.

## 6. Metryki sukcesu

Kluczowe wskaźniki (KPI) służące do pomiaru sukcesu MVP:

1.  Jakość generowania AI:
    *   Cel: 75% fiszek wygenerowanych przez AI jest akceptowanych przez użytkownika bez edycji.
    *   Pomiar: Monitorowanie akcji użytkownika ("Akceptuj", "Edytuj", "Usuń") dla każdej fiszki wygenerowanej przez AI. Obliczenie wskaźnika: `Liczba_Akcji_Akceptuj / (Liczba_Akcji_Akceptuj + Liczba_Akcji_Edytuj + Liczba_Akcji_Usuń)` dla danej sesji generowania lub w określonym przedziale czasowym. Logi powinny być przechowywane w bazie danych i umożliwiać agregację wyników.

2.  Adopcja funkcji generowania AI:
    *   Cel: Użytkownicy tworzą 75% wszystkich swoich fiszek za pomocą funkcji generowania AI.
    *   Pomiar: Śledzenie źródła utworzenia każdej fiszki (AI vs Manualnie). Obliczenie wskaźnika: `Liczba_Fiszek_AI / (Liczba_Fiszek_AI + Liczba_Fiszek_Manualnych)` w systemie lub w określonym przedziale czasowym. Wymaga zapisywania atrybutu źródła dla każdej fiszki w bazie danych. 