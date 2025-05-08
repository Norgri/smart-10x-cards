# Ulepszenia Systemu Autentykacji

## Zapamiętywanie Ścieżki Przed Przekierowaniem
### Problem
Obecnie system zawsze przekierowuje na `/generate` po zalogowaniu, co może być niewygodne jeśli użytkownik próbował dostać się do innej chronionej strony.

### Proponowane Rozwiązanie
1. Implementacja mechanizmu zapamiętywania oryginalnej ścieżki:
   - Zapisywanie ścieżki w `localStorage` przed przekierowaniem na login
   - Dodanie parametru `redirectTo` w URL strony logowania
   - Obsługa przekierowania po udanym logowaniu
2. Obsługa edge cases:
   - Walidacja zapisanej ścieżki pod kątem bezpieczeństwa
   - Czyszczenie zapisanej ścieżki po udanym przekierowaniu
   - Domyślne przekierowanie na `/generate` jeśli brak zapisanej ścieżki

### Spodziewane Korzyści
- Lepsza użyteczność systemu
- Zachowanie kontekstu użytkownika
- Płynniejsze doświadczenie użytkownika

## Funkcjonalność "Remember Me"
### Problem
Użytkownicy muszą logować się przy każdej sesji, co może być uciążliwe przy częstym korzystaniu z aplikacji.

### Proponowane Rozwiązanie
1. Dodanie opcji "Zapamiętaj mnie" w formularzu logowania:
   - Checkbox w interfejsie użytkownika
   - Konfiguracja dłuższego czasu życia tokenu sesji
   - Bezpieczne przechowywanie refresh tokenu
2. Implementacja automatycznego odświeżania sesji:
   - Obsługa wygasania tokenu
   - Automatyczne odświeżanie w tle
   - Obsługa błędów odświeżania

### Spodziewane Korzyści
- Wygodniejsze korzystanie z aplikacji
- Mniej przerw w pracy użytkownika
- Zachowanie bezpieczeństwa przy jednoczesnej wygodzie

## Zabezpieczenia Przed Atakami
### Problem
Podstawowa implementacja autentykacji może być podatna na różne rodzaje ataków.

### Proponowane Rozwiązanie
1. Implementacja CAPTCHA:
   - Integracja z reCAPTCHA v3
   - Aktywacja przy podejrzanych zachowaniach
   - Konfigurowalny próg wyzwalania
2. Rate Limiting:
   - Ograniczenie liczby prób logowania
   - Progresywne wydłużanie czasu blokady
   - Monitoring i alerting
3. Bezpieczne Przechowywanie Sesji:
   - Rotacja tokenów
   - Unieważnianie sesji przy podejrzanych działaniach
   - Monitorowanie równoczesnych sesji

### Spodziewane Korzyści
- Zwiększone bezpieczeństwo
- Ochrona przed atakami brute-force
- Lepsza wykrywalność podejrzanych działań

## Priorytetyzacja Wdrożenia
1. Zapamiętywanie Ścieżki (Wysoki Wpływ/Niski Nakład)
2. Rate Limiting (Wysoki Wpływ/Średni Nakład)
3. "Remember Me" (Średni Wpływ/Niski Nakład)
4. CAPTCHA (Średni Wpływ/Wysoki Nakład)

## Monitorowanie i Analityka
1. Śledzenie:
   - Liczby nieudanych prób logowania
   - Czasu trwania sesji
   - Wykorzystania "Remember Me"
   - Skuteczności CAPTCHA
2. Alerty:
   - Nietypowe wzorce logowań
   - Przekroczenie progów rate limitingu
   - Problemy z odświeżaniem tokenów

Te ulepszenia powinny być wdrażane stopniowo, z uwzględnieniem priorytetów i zależności między funkcjami. 