# Planowane rozszerzenia nawigacji (poza MVP)

## Elementy nawigacji do wdrożenia w przyszłych wersjach

### Strona ustawień
- **Ścieżka**: `/settings`
- **Opis**: Strona ustawień konta użytkownika, gdzie można zarządzać preferencjami, danymi osobowymi itp.
- **Implementacja**: Komponent należy dodać do głównej nawigacji oraz menu mobilnego

### Opcje menu użytkownika

#### Profil
- **Opis**: Opcja w menu użytkownika umożliwiająca przejście do profilu użytkownika
- **Implementacja**: 
  ```typescript
  <UserMenuOption 
    label="Profil" 
    icon={<ProfileIcon />} 
    onClick={() => navigate('/profile')} 
  />
  ```

#### Ustawienia
- **Opis**: Opcja w menu użytkownika umożliwiająca przejście do ustawień konta
- **Implementacja**: 
  ```typescript
  <UserMenuOption 
    label="Ustawienia" 
    icon={<SettingsIcon />} 
    onClick={() => navigate('/settings')} 
  />
  ```

## Modyfikacje struktury komponentów
```
Layout
├── Navbar/TopBar
│   ├── NavItem (Dashboard)
│   ├── NavItem (Generowanie)
│   ├── NavItem (Ustawienia) <!-- Do wdrożenia w przyszłych wersjach -->
│   ├── UserMenu
│   │   ├── UserMenuOption (Profil) <!-- Do wdrożenia w przyszłych wersjach -->
│   │   ├── UserMenuOption (Ustawienia) <!-- Do wdrożenia w przyszłych wersjach -->
│   │   └── UserMenuOption (Wyloguj)
│   └── MobileMenuButton
└── MobileMenu (wyświetlane warunkowo)
    ├── NavItem (Dashboard)
    ├── NavItem (Generowanie)
    ├── NavItem (Ustawienia) <!-- Do wdrożenia w przyszłych wersjach -->
    └── UserMenuOptions
``` 