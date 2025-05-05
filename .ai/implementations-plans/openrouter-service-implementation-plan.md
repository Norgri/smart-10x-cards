/* Plan implementacji usługi OpenRouter */

# Plan implementacji usługi OpenRouter

Niniejszy dokument zawiera kompleksowy przewodnik wdrożenia usługi OpenRouter, która integruje się z API OpenRouter w celu wzbogacenia funkcjonalności czatu opartych na LLM. Przewodnik został opracowany zgodnie z zasadami programowania przyjętymi w naszym projekcie oraz z wykorzystaniem następującego stacku technologicznego: Astro 5, TypeScript 5, React 19, Tailwind 4, Shadcn/ui.

---

## 1. Opis usługi

Usługa OpenRouter odpowiada za komunikację z API OpenRouter. Jej główne funkcje to:

1. Wysyłanie i odbieranie wiadomości z API OpenRouter w celu wsparcia zaawansowanej obsługi czatu.
2. Tworzenie dobrze skonstruowanych ładunków danych, które łączą komunikaty systemowe, komunikaty użytkownika oraz formatowanie odpowiedzi według predefiniowanego schematu JSON.
3. Konfigurowanie i zarządzanie parametrami modelu (np. nazwa modelu, temperature, max_tokens) w celu kontrolowania zachowania modelu językowego.

### Kluczowe komponenty usługi OpenRouter

1. **API Client Manager**
   - **Funkcjonalność:** Zarządza komunikacją z API OpenRouter, w tym konfiguracją klienta HTTP, obsługą nagłówków, limitami czasowymi oraz ponownymi próbami nawiązania połączenia.
   - **Potencjalne wyzwania:**
     1. Niestabilność sieci lub problemy z połączeniem.
     2. Opóźnienia i przekroczenia limitu czasu podczas wywołań API.
   - **Proponowane rozwiązania:**
     1. Implementacja mechanizmów ponawiania prób z wykładniczym opóźnieniem.
     2. Skonfigurowanie odpowiednich limitów czasowych oraz mechanizmów awaryjnych.

2. **Payload Builder**
   - **Funkcjonalność:** Tworzy ładunki danych, które integrują komunikaty systemowe, wejścia od użytkownika oraz ustrukturyzowany format odpowiedzi dla API.
   - **Potencjalne wyzwania:**
     1. Zapewnienie, że ładunek danych ściśle odpowiada wymaganemu schematowi JSON.
     2. Obsługa dynamicznych wariantów danych wejściowych.
   - **Proponowane rozwiązania:**
     1. Użycie standaryzowanego walidatora schematu JSON przed wysłaniem żądania.
     2. Modularne podejście do budowania ładunku danych w celu ułatwienia testowania i utrzymania kodu.

3. **Response Parser & Validator**
   - **Funkcjonalność:** Przetwarza odpowiedzi API, walidując je według zdefiniowanego schematu JSON oraz wydobywając niezbędne dane do dalszego przetwarzania.
   - **Potencjalne wyzwania:**
     1. Otrzymywanie nieprawidłowych lub niekompletnych odpowiedzi.
     2. Różnice w schemacie spowodowane aktualizacjami API lub błędami.
   - **Proponowane rozwiązania:**
     1. Implementacja rygorystycznej walidacji schematu JSON.
     2. Zaimplementowanie logiki awaryjnej oraz czytelnych komunikatów błędów w przypadku niezgodności.

4. **Error Handling Module**
   - **Funkcjonalność:** Rejestruje, loguje i zarządza błędami występującymi w usłudze, w tym błędami sieci, przekroczeniami limitu czasu oraz problemami związanymi z autoryzacją.
   - **Potencjalne wyzwania:**
     1. Identyfikacja przyczyny błędów w złożonych interakcjach z API.
     2. Utrzymanie przyjaznych dla użytkownika komunikatów błędów przy jednoczesnym logowaniu szczegółowych informacji diagnostycznych.
   - **Proponowane rozwiązania:**
     1. Wykorzystanie scentralizowanego systemu logowania błędów.
     2. Implementacja jasnych i zwięzłych komunikatów błędów dla użytkowników końcowych, przy jednoczesnym zachowywaniu szczegółowych logów dla deweloperów.

---

## 2. Opis konstruktora

Konstruktor inicjalizuje usługę OpenRouter, konfigurując niezbędne zależności oraz ustawienia. Wykonuje następujące kroki:

1. Ładuje wartości konfiguracyjne (punkt końcowy API, klucz API, domyślną nazwę modelu oraz parametry) z zmiennych środowiskowych lub plików konfiguracyjnych.
2. Inicjalizuje i konfiguruje klienta API do komunikacji z API OpenRouter.
3. Ustawia domyślne wartości dla komunikatów systemowych, formatów odpowiedzi oraz mechanizmów logowania.

---

## 3. Publiczne metody i pola

Usługa udostępnia następujące metody i pola publiczne:

1. **sendRequest(message: string, additionalParams?: object): Promise<Response>**
   - Tworzy ładunek danych zawierający komunikaty systemowe i użytkownika, do którego dołączony jest format odpowiedzi, nazwa modelu oraz parametry modelu.
   - Wysyła żądanie do API OpenRouter i zwraca promisa z otrzymaną odpowiedzią.

2. **config: object**
   - Publiczny obiekt konfiguracyjny zawierający punkt końcowy API, nazwę modelu, parametry modelu oraz inne istotne ustawienia.

3. **parseResponse(apiResponse: any): ParsedResponse**
   - Przetwarza i waliduje odpowiedź API według zdefiniowanego schematu JSON przy użyciu formatu odpowiedzi.
   - Zwraca ustrukturyzowany obiekt odpowiedzi.

---

## 4. Prywatne metody i pola

Usługa zawiera również kilka metod i pól prywatnych, które enkapsulują logikę wewnętrzną:

1. **initializeClient(): void**
   - Prywatna metoda, która konfiguruje klienta API z niezbędnymi nagłówkami i limitami czasowymi.

2. **validateResponse(response: any): boolean**
   - Waliduje odpowiedź API w oparciu o zdefiniowany schemat JSON.

3. **logError(error: Error): void**
   - Rejestruje błędy, upewniając się, że poufne informacje nie są ujawniane.

4. **buildPayload(message: string, additionalParams: object): object**
   - Tworzy pełny ładunek danych, który zawiera komunikat systemowy, komunikat użytkownika, format odpowiedzi, nazwę modelu oraz parametry modelu.

---

## 5. Obsługa błędów

Obsługa błędów jest kluczowym elementem usługi. Potencjalne scenariusze błędów obejmują:

1. **Błędy sieciowe**
   - *Wyzwanie:* Utrata połączenia lub problemy z siecią.
   - *Rozwiązanie:* Implementacja mechanizmu ponawiania prób z wykładniczym opóźnieniem oraz timeout.

2. **Przekroczenie limitu czasu**
   - *Wyzwanie:* Żądanie trwa zbyt długo.
   - *Rozwiązanie:* Ustawienie limitów czasowych oraz zastosowanie odpowiednich komunikatów błędów.

3. **Nieprawidłowe lub niekompletne odpowiedzi**
   - *Wyzwanie:* Odpowiedź nie spełnia zdefiniowanego schematu JSON.
   - *Rozwiązanie:* Walidacja odpowiedzi przy użyciu metody `validateResponse()` i zwracanie przyjaznych komunikatów błędów.

4. **Błąd autoryzacji**
   - *Wyzwanie:* Niewłaściwy lub wygasły klucz API.
   - *Rozwiązanie:* Weryfikacja autoryzacji i zwrócenie komunikatu "Unauthorized".

5. **Ograniczenia liczby zapytań (Rate Limiting)**
   - *Wyzwanie:* Przekroczenie limitu zapytań do API.
   - *Rozwiązanie:* Obsługa odpowiednich statusów HTTP oraz implementacja mechanizmu kolejkowania.

---

## 6. Kwestie bezpieczeństwa

Zalecenia bezpieczeństwa obejmują:

1. **Przechowywanie poświadczeń:** Klucze API oraz inne dane wrażliwe powinny być przechowywane w zmiennych środowiskowych lub bezpiecznych magazynach.
2. **Bezpieczna komunikacja:** Korzystanie z protokołu TLS/HTTPS do wymiany danych z API OpenRouter.
3. **Sanityzacja danych:** Walidacja wszystkich danych wejściowych od użytkownika oraz odpowiedzi API.
4. **Logowanie:** Upewnienie się, że logi nie zawierają poufnych informacji.

---

## 7. Plan wdrożenia krok po kroku

1. **Konfiguracja środowiska:**
   - Skonfiguruj plik `.env` z następującymi zmiennymi:
     1. `OPENROUTER_API_ENDPOINT`
     2. `OPENROUTER_API_KEY`
     3. `DEFAULT_MODEL_NAME` (np. "gpt-3.5-turbo")
     4. `MODEL_PARAMETERS` (ciąg JSON zawierający parametry, np. `{"max_tokens": 150, "temperature": 0.7}`)

2. **Inicjalizacja serwisu:**
   - W module startowym aplikacji (np. w pliku inicjalizacyjnym lub w dedykowanej sekcji konfiguracji) utwórz instancję usługi OpenRouter, wykorzystując powyższe zmienne.

3. **Implementacja budowy ładunku danych:**
   - Zaimplementuj metodę `buildPayload()` w celu utworzenia struktury żądania, która zawiera:
     1. **Komunikat systemowy:**
        - Przykład: "System: Please format your response as a structured JSON following the provided schema."
     2. **Komunikat użytkownika:**
        - Przekazuje konkretne wejście użytkownika, np. zapytanie lub polecenie.
     3. **Response Format:**
        - Użyj wzoru:
          ```json
          { "type": "json_schema", "json_schema": { "name": "openRouterResponse", "strict": true, "schema": { /* schema object */ } } }
          ```
     4. **Nazwa modelu:**
        - Przykładowo: "gpt-3.5-turbo".
     5. **Parametry modelu:**
        - Przykładowo: `{ "max_tokens": 150, "temperature": 0.7 }`.

4. **Wysyłanie żądania:**
   - W metodzie `sendRequest()` wywołaj metodę `buildPayload()` oraz wyślij żądanie do API OpenRouter. Obsłuż asynchroniczność i potencjalne błędy.

5. **Walidacja i analiza odpowiedzi:**
   - Po otrzymaniu odpowiedzi użyj metody `validateResponse()` w celu sprawdzenia jej zgodności ze schematem, a następnie wywołaj metodę `parseResponse()`.

6. **Obsługa błędów:**
   - Upewnij się, że wszystkie zaproponowane sytuacje błędów (np. błędy sieci, przekroczenie limitu czasu, nieprawidłowe odpowiedzi) są logowane przy użyciu metody `logError()` oraz, że odpowiednie komunikaty są zwracane użytkownikowi.

7. **Testy i monitorowanie:**
   - Stwórz testy jednostkowe i integracyjne w celu walidacji działania usługi. Monitoruj logi oraz wydajność, by móc szybko reagować na ewentualne problemy.

---

_End of Plan implementacji usługi OpenRouter_ 