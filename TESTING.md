# Testowanie Smart 10x Cards

Ten dokument zawiera szczegóły dotyczące strategii testowania i konfiguracji testów dla aplikacji Smart 10x Cards.

## Struktura testów

- **Testy jednostkowe** (`./src/__tests__/`) - testowanie pojedynczych komponentów i funkcji
  - `./src/__tests__/components/` - testy komponentów React
  - `./src/__tests__/utils/` - testy funkcji narzędziowych
  - `./src/__tests__/mocks/` - mocki danych i API do testów

- **Testy end-to-end** (`./e2e/`) - testowanie pełnych ścieżek użytkownika
  - `./e2e/utils/` - funkcje pomocnicze do testów E2E

## Testy jednostkowe i integracyjne (Vitest)

Testy jednostkowe są pisane przy użyciu Vitest i React Testing Library.

### Uruchamianie testów jednostkowych

```bash
# Uruchom wszystkie testy jednostkowe
npm test

# Uruchom testy w trybie watch (podczas developmentu)
npm run test:watch

# Wygeneruj raport pokrycia kodu
npm run test:coverage
```

### Tworzenie testów jednostkowych

Pliki testowe powinny mieć rozszerzenie `.test.ts` lub `.test.tsx` i być umieszczone w katalogu `src/__tests__/`.

Przykład testu jednostkowego:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MyComponent } from '@/components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected text')).toBeInTheDocument();
  });
});
```

### Mockowanie API

Do mockowania API używamy Mock Service Worker (MSW). Konfiguracja znajduje się w katalogu `src/__tests__/mocks/`.

## Testy End-to-End (Playwright)

Testy E2E są pisane przy użyciu Playwright i znajdują się w katalogu `e2e/`.

### Uruchamianie testów E2E

```bash
# Uruchom wszystkie testy E2E
npm run test:e2e

# Uruchom testy E2E z UI
npm run test:e2e:ui

# Uruchom testy E2E w trybie debug
npm run test:e2e:debug

# Pokaż raport z testów E2E
npm run test:e2e:report

# Uruchom testy E2E z ręcznym uruchomieniem serwera dev
npm run test:e2e:manual
```

### Rozwiązywanie problemów z testami E2E

Jeśli napotkasz problem z time-outem podczas uruchamiania testów E2E:

1. Upewnij się, że aplikacja uruchamia się poprawnie:
   ```bash
   npm run dev
   ```

2. Sprawdź, czy porty w konfiguracji Playwright i Astro są zgodne.

3. Użyj trybu debug, aby zobaczyć, co dzieje się podczas testu:
   ```bash
   npm run test:e2e:debug
   ```

4. Spróbuj uruchomić testy z ręcznym startem serwera:
   ```bash
   npm run test:e2e:manual
   ```

### Pomocnicze funkcje dla testów E2E

W katalogu `e2e/utils/` znajdują się pomocnicze funkcje ułatwiające pisanie testów E2E, np. funkcje do logowania i rejestracji użytkownika.

## Ciągła integracja (CI)

Testy są automatycznie uruchamiane w środowisku CI przy każdym pull requeście za pomocą GitHub Actions.

Konfiguracja CI znajduje się w pliku `.github/workflows/test.yml`. 