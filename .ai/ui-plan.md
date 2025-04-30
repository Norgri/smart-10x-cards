# Architektura UI dla Smart 10x Cards

## 1. Przegląd struktury UI

Interfejs użytkownika Smart 10x Cards będzie oparty na nowoczesnych technologiach (Astro, React, TypeScript, Tailwind, Shadcn/ui) i zaprojektowany zgodnie z zasadami UX, dostępności oraz bezpieczeństwa. Cała aplikacja będzie podzielona na kilka głównych widoków: widok autoryzacji, generowania fiszek (w tym przesyłanie zdjęcia) oraz dashboard, w którym fiszki są edytowane in-place. Interfejs zapewnia intuicyjną nawigację, wyraźne komunikaty błędów oraz zabezpieczenia związane z autoryzacją.

## 2. Lista widoków

### 2.1. Strona Rejestracji i Logowania

- **Nazwa widoku:** Autoryzacja
- **Ścieżka widoku:** `/login` oraz `/register`
- **Główny cel:** Pozwolić użytkownikom na rejestrację oraz logowanie przy użyciu adresu e-mail i hasła.
- **Kluczowe informacje do wyświetlenia:** Formularze rejestracji/logowania, komunikaty o błędach walidacji, linki do odzyskiwania hasła.
- **Kluczowe komponenty widoku:** Formularz, pole tekstowe, przyciski, komunikaty walidacyjne.
- **UX, dostępność i względy bezpieczeństwa:** Zapewnienie czytelnych komunikatów o błędach, wsparcie dla czytników ekranu, walidacja po stronie klienta i serwera, ochrona przed atakami typu brute force.

### 2.2. Dashboard / Główna Strona Użytkownika

- **Nazwa widoku:** Dashboard
- **Ścieżka widoku:** `/dashboard`
- **Główny cel:** Centralne miejsce, w którym użytkownik może przeglądać wszystkie swoje fiszki oraz zarządzać ich edycją in-place.
- **Kluczowe informacje do wyświetlenia:** Lista fiszek prezentowana w formie gridu, liczba fiszek AI vs manualnych, powiadomienia o sesjach generowania, komunikaty o błędach podczas operacji (edycja, usunięcie, akceptacja).
- **Kluczowe komponenty widoku:** Lista/karta z fiszkami z możliwością edycji in-place, przyciski akcji, pasek wyszukiwania/filter tagów, powiadomienia.
- **UX, dostępność i względy bezpieczeństwa:** Responsywność, możliwość filtrowania/wyszukiwania fiszek, wsparcie dla klawiatury, natychmiastowa walidacja podczas edycji, potwierdzenie przed usunięciem, zabezpieczenie przed nieautoryzowanym dostępem.

### 2.3. Widok Generowania Fiszek przez AI

- **Nazwa widoku:** Generowanie fiszek
- **Ścieżka widoku:** `/generate`
- **Główny cel:** Umożliwić użytkownikowi przesłanie zdjęcia strony podręcznika i wyświetlenie wyników generowania fiszek przez AI.
- **Kluczowe informacje do wyświetlenia:** U góry widoku znajduje się input do przesłania zdjęcia oraz przycisk "Generuj". Po kliknięciu przycisku wyświetlany jest loader informujący o trwającym procesie. Po udanej generacji, poniżej inputu prezentowane są karty fiszek w formie gridu. W przypadku niepowodzenia wyświetlany jest komunikat o błędzie.
- **Kluczowe komponenty widoku:** Input do przesyłania zdjęcia, przycisk "Generuj", wskaźnik ładowania, karty fiszek, komunikat o błędzie.
- **UX, dostępność i względy bezpieczeństwa:** Intuicyjny interfejs z możliwością wielokrotnych prób generowania, natychmiastowy feedback w postaci loadera, wizualne wskazanie błędu, walidacja przesyłanego pliku (format, rozmiar), zabezpieczenie przed przypadkowym wielokrotnym wysłaniem obrazu.

### 2.4. Widok Szczegółów Sesji Generowania i Logów Akcji

- **Nazwa widoku:** Sesje generowania i logi
- **Ścieżka widoku:** `/sessions` oraz `/sessions/:id`
- **Główny cel:** Przegląd sesji generowania AI oraz logów działań na wygenerowanych fiszkach (zaakceptowano, edytowano, usunięto) i błędów.
- **Kluczowe informacje do wyświetlenia:** Lista sesji, szczegóły konkretnej sesji (czas trwania, model, data), logi akcji, ewentualne błędy generacji.
- **Kluczowe komponenty widoku:** Tabela/lista sesji, szczegółowy panel dla wybranej sesji, przyciski filtrowania, komunikaty o błędach.
- **UX, dostępność i względy bezpieczeństwa:** Przejrzystość informacji, możliwość filtrowania logów, mechanizmy paginacji, ochrona danych przed nieautoryzowanym dostępem.

## 3. Mapa podróży użytkownika

1. Użytkownik trafia na stronę rejestracji/logowania (`/login` lub `/register`).
2. Po pomyślnym zalogowaniu użytkownik trafia do Dashboardu (`/dashboard`), gdzie przegląda listę swoich fiszek. Fiszki są edytowane in-place bez przechodzenia do osobnych widoków.
3. Użytkownik decyduje się na generowanie nowych fiszek i przechodzi do widoku generowania (`/generate`).
4. Na widoku generowania użytkownik przesyła zdjęcie za pomocą inputu i klika przycisk "Generuj". Po kliknięciu wyświetlany jest loader, a następnie, w przypadku sukcesu, widok prezentuje input oraz wygenerowane fiszki w formie gridu. W przypadku błędu wyświetlany jest odpowiedni komunikat.
5. Akcje takie jak edycja in-place czy usuwanie fiszek są wykonywane bezpośrednio z poziomu Dashboardu.
6. Użytkownik może przeglądać szczegóły sesji generowania i logów w widoku `/sessions`.

## 4. Układ i struktura nawigacji

- Główna nawigacja (navbar lub sidebar) będzie dostępna na wszystkich widokach po zalogowaniu.
- Elementy nawigacyjne obejmują: Dashboard, Generowanie fiszek oraz Sesje generowania, a także ustawienia konta.
- Nawigacja będzie responsywna – pasek boczny na większych ekranach oraz menu hamburgera na urządzeniach mobilnych.
- Ważne linki i akcje będą wyposażone w odpowiednie etykiety ARIA, aby wspierać dostępność, oraz będą zabezpieczone przed nieautoryzowanym dostępem.

## 5. Kluczowe komponenty

- **Formularze Autoryzacji:** Komponenty do rejestracji i logowania, walidujące dane w czasie rzeczywistym.
- **Komponent Listy/Kart Fiszek:** Dynamiczne karty prezentujące fiszki z możliwością edycji in-place, wspierające akcje edycji, usunięcia, akceptacji oraz filtrowanie tagów.
- **Komponent Input i Loader w Widoku Generowania:** Moduł umożliwiający przesłanie zdjęcia oraz przycisk "Generuj", po których wyświetlany jest loader, a następnie wyniki generowania.
- **Komponent Modal/Okienko Dialogowe:** Do potwierdzania akcji (np. usunięcia) oraz prezentacji komunikatów błędów.
- **Komponent Powiadomień:** Wyświetlanie komunikatów sukcesu, błędów oraz statusów operacji, zgodnie z zasadami dostępności.

---

Plan ten zapewnia, że każdy element interfejsu odpowiada wymaganiom zawartym w PRD, jest zgodny z API (np. operacje CRUD na fiszkach, sesje generowania) oraz umożliwia użytkownikowi efektywną i intuicyjną pracę z aplikacją Smart 10x Cards. 