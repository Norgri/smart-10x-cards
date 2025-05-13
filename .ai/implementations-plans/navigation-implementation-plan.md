# Plan implementacji nawigacji

## 1. Przegląd
Nawigacja w aplikacji Smart 10x Cards służy jako główny punkt dostępu do wszystkich funkcjonalności aplikacji. Składa się z górnego paska (topbar) widocznego na wszystkich stronach po zalogowaniu, który przekształca się w menu hamburgerowe na urządzeniach mobilnych. Nawigacja zapewnia użytkownikom dostęp do kluczowych sekcji aplikacji, w tym dashboardu i generatora fiszek, jednocześnie spełniając wymagania dostępności i bezpieczeństwa.

## 2. Routing nawigacji
Nawigacja powinna prowadzić do następujących ścieżek:
- `/` lub `/dashboard` - Strona główna z przeglądem fiszek użytkownika
- `/generate` - Strona generowania fiszek przez AI
- `/auth/login` - Strona logowania (przekierowanie dla niezalogowanych użytkowników)

## 3. Struktura komponentów
```
Layout
├── Navbar/TopBar
│   ├── NavItem (Dashboard)
│   ├── NavItem (Generowanie)
│   ├── UserMenu
│   │   └── UserMenuOption (Wyloguj)
│   └── MobileMenuButton
└── MobileMenu (wyświetlane warunkowo)
    ├── NavItem (Dashboard)
    ├── NavItem (Generowanie)
    └── UserMenuOptions
```

## 4. Szczegóły komponentów

### Navbar/TopBar
- **Opis komponentu**: Główny komponent nawigacyjny wyświetlany na górze każdej strony po zalogowaniu. Zawiera logo aplikacji, elementy nawigacyjne oraz menu użytkownika.
- **Główne elementy**: 
  - Logo aplikacji (link do dashboardu)
  - Elementy nawigacyjne (Dashboard, Generowanie)
  - Przycisk hamburgera na urządzeniach mobilnych
  - Menu użytkownika z awatarem/email i opcjami konta
- **Obsługiwane interakcje**: 
  - Kliknięcie na logo - przekierowanie do dashboardu
  - Kliknięcie na elementy nawigacji - przekierowanie do odpowiednich stron
  - Kliknięcie na przycisk hamburgera - otwarcie/zamknięcie menu mobilnego
  - Kliknięcie na awatar/email - otwarcie/zamknięcie menu użytkownika
- **Obsługiwana walidacja**: Sprawdzanie, czy użytkownik jest zalogowany
- **Typy**: NavbarProps
- **Propsy**:
  ```typescript
  interface NavbarProps {
    user: { id: string; email: string | null };
    onLogout: () => void;
    currentPath: string;
  }
  ```

### NavItem
- **Opis komponentu**: Reprezentuje pojedynczy element nawigacji z ikoną i etykietą.
- **Główne elementy**: Ikona, etykieta, link
- **Obsługiwane interakcje**: Kliknięcie (przekierowanie), hover (efekt wizualny)
- **Obsługiwana walidacja**: Sprawdzanie, czy element jest aktywny na podstawie bieżącej ścieżki
- **Typy**: NavItemProps
- **Propsy**:
  ```typescript
  interface NavItemProps {
    label: string;
    href: string;
    icon?: React.ReactNode;
    isActive?: boolean;
    isMobile?: boolean;
  }
  ```

### MobileMenuButton
- **Opis komponentu**: Przycisk do otwierania/zamykania menu mobilnego.
- **Główne elementy**: Ikona hamburgera/krzyżyka
- **Obsługiwane interakcje**: Kliknięcie (przełączanie menu)
- **Obsługiwana walidacja**: Brak
- **Typy**: MobileMenuButtonProps
- **Propsy**:
  ```typescript
  interface MobileMenuButtonProps {
    isOpen: boolean;
    onClick: () => void;
  }
  ```

### MobileMenu
- **Opis komponentu**: Menu nawigacyjne dla urządzeń mobilnych, wyświetlane po kliknięciu przycisku hamburgera.
- **Główne elementy**: Lista elementów nawigacyjnych, opcje użytkownika
- **Obsługiwane interakcje**: 
  - Kliknięcie na elementy - przekierowanie
  - Kliknięcie poza menu - zamknięcie menu
- **Obsługiwana walidacja**: Sprawdzanie, czy menu powinno być otwarte
- **Typy**: MobileMenuProps
- **Propsy**:
  ```typescript
  interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    user: { id: string; email: string | null };
    onLogout: () => void;
    currentPath: string;
  }
  ```

### UserMenu
- **Opis komponentu**: Menu rozwijane z opcjami konta użytkownika.
- **Główne elementy**: 
  - Awatar/email użytkownika (trigger)
  - Opcja wylogowania
- **Obsługiwane interakcje**: 
  - Kliknięcie na awatar/email - otwarcie/zamknięcie menu
  - Kliknięcie na opcję wylogowania - wykonanie odpowiedniej akcji
  - Kliknięcie poza menu - zamknięcie menu
- **Obsługiwana walidacja**: Sprawdzanie, czy użytkownik jest zalogowany
- **Typy**: UserMenuProps
- **Propsy**:
  ```typescript
  interface UserMenuProps {
    user: { id: string; email: string | null };
    onLogout: () => void;
  }
  ```

### UserMenuOption
- **Opis komponentu**: Pojedyncza opcja w menu użytkownika.
- **Główne elementy**: Ikona, etykieta
- **Obsługiwane interakcje**: Kliknięcie (wykonanie akcji), hover (efekt wizualny)
- **Obsługiwana walidacja**: Brak
- **Typy**: UserMenuOptionProps
- **Propsy**:
  ```typescript
  interface UserMenuOptionProps {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    isDanger?: boolean;
  }
  ```

## 5. Typy
```typescript
// Główne typy dla nawigacji
interface NavbarProps {
  user: { id: string; email: string | null };
  onLogout: () => void;
  currentPath: string;
}

interface NavItemProps {
  label: string;
  href: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  isMobile?: boolean;
}

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: { id: string; email: string | null };
  onLogout: () => void;
  currentPath: string;
}

interface UserMenuProps {
  user: { id: string; email: string | null };
  onLogout: () => void;
}

interface UserMenuOptionProps {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  isDanger?: boolean;
}

// Hook do zarządzania nawigacją
interface UseNavigationResult {
  currentPath: string;
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  isActive: (path: string) => boolean;
}
```

## 6. Zarządzanie stanem
Do zarządzania stanem nawigacji zalecamy stworzenie niestandardowego hooka `useNavigation`, który będzie odpowiedzialny za:

1. Śledzenie bieżącej ścieżki:
```typescript
const currentPath = window.location.pathname;
```

2. Zarządzanie stanem menu mobilnego:
```typescript
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
const closeMobileMenu = () => setIsMobileMenuOpen(false);
```

3. Sprawdzanie, czy dana ścieżka jest aktywna:
```typescript
const isActive = (path: string) => {
  if (path === '/') {
    return currentPath === '/' || currentPath === '/dashboard';
  }
  return currentPath.startsWith(path);
};
```

4. Obsługa responsywności z użyciem hooka `useMediaQuery`:
```typescript
const isMobile = useMediaQuery('(max-width: 768px)');
```

## 7. Interakcje użytkownika
1. **Kliknięcie na element nawigacji**:
   - Oczekiwany rezultat: Przekierowanie do odpowiedniej strony
   - Implementacja: Użycie Astro View Transitions API dla płynnych przejść między stronami

2. **Kliknięcie na przycisk hamburgera na urządzeniu mobilnym**:
   - Oczekiwany rezultat: Otwarcie/zamknięcie menu mobilnego
   - Implementacja: Wywołanie `toggleMobileMenu` z hooka `useNavigation`

3. **Kliknięcie na awatar/email użytkownika**:
   - Oczekiwany rezultat: Otwarcie/zamknięcie menu użytkownika
   - Implementacja: Użycie komponentu `DropdownMenu` z Shadcn/ui

4. **Kliknięcie na opcję "Wyloguj"**:
   - Oczekiwany rezultat: Wylogowanie i przekierowanie do strony logowania
   - Implementacja: Wywołanie `onLogout` z propsów

5. **Zmiana rozmiaru okna przeglądarki**:
   - Oczekiwany rezultat: Przełączenie między widokiem topbar a menu hamburgerowym
   - Implementacja: Użycie media queries z Tailwind i hooka `useMediaQuery`

## 8. Obsługa błędów
1. **Użytkownik niezalogowany próbuje uzyskać dostęp do chronionej strony**:
   - Rozwiązanie: Middleware Astro już zapewnia przekierowanie na `/auth/login`

2. **Brak danych użytkownika**:
   - Rozwiązanie: Wyświetlenie fallbacku (np. generycznego awatara) i zachowanie podstawowej funkcjonalności lub przekierowanie do strony logowania

3. **Błąd sieci podczas wylogowywania**:
   - Rozwiązanie: Wyświetlenie powiadomienia o błędzie i ponowienie próby
   - Implementacja: Obsługa wyjątków w funkcji wylogowywania

4. **Niespójny stan po wylogowaniu**:
   - Rozwiązanie: Czyszczenie lokalnego stanu i przekierowanie do strony logowania
   - Implementacja: Użycie `window.location.href = '/auth/login'` po wyczyszczeniu stanu

## 9. Kroki implementacji
1. **Stworzenie podstawowych komponentów**:
   - Utworzenie plików komponentów w `src/components/navigation/`
   - Implementacja podstawowej struktury każdego komponentu

2. **Implementacja niestandardowych hooków**:
   - Utworzenie `useNavigation.ts` w `src/lib/hooks/`
   - Implementacja logiki zarządzania stanem nawigacji

3. **Integracja z Astro Layout**:
   - Dodanie komponentu Navbar do głównego layoutu (`src/layouts/Layout.astro`)
   - Przekazanie niezbędnych propsów (user, currentPath)

4. **Stylizacja z użyciem Tailwind**:
   - Implementacja responsywnych stylów
   - Konfiguracja breakpointów dla widoku mobilnego/desktopowego

5. **Implementacja dostępności**:
   - Dodanie odpowiednich atrybutów ARIA
   - Implementacja obsługi klawiatury
   - Zapewnienie odpowiednich kontrastów

6. **Testowanie**:
   - Sprawdzenie działania na różnych rozmiarach ekranu
   - Weryfikacja dostępności
   - Testowanie wszystkich interakcji użytkownika

7. **Integracja z systemem autentykacji**:
   - Podłączenie funkcji wylogowywania
   - Zapewnienie przekierowań dla niezalogowanych użytkowników

8. **Optymalizacja**:
   - Refaktoryzacja kodu w celu eliminacji powtórzeń
   - Optymalizacja renderowania (memoizacja, usunięcie niepotrzebnych renderów) 