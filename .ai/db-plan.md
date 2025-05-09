# Schemat bazy danych PostgreSQL

## 1. Tabele i ich kolumny

### 1.1. users

This table is managed by Supabase Auth.

- **id**: UUID PRIMARY KEY
- **email**: VARCHAR(255) NOT NULL UNIQUE
- **encrypted_password**: VARCHAR NOT NULL
- **first_name**: VARCHAR(100) DEFAULT NULL
- **last_name**: VARCHAR(100) DEFAULT NULL
- **last_login**: TIMESTAMPTZ NULL
- **created_at**: TIMESTAMPTZ NOT NULL DEFAULT NOW()
- **updated_at**: TIMESTAMPTZ NOT NULL DEFAULT NOW()
- **confirmed_at**: TIMESTAMPTZ

### 1.2. flashcards
- **id**: BIGSERIAL PRIMARY KEY
- **user_id**: UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
- **front**: TEXT NOT NULL
- **back**: TEXT NOT NULL
- **phonetic**: TEXT NULL
- **source**: VARCHAR(10) NOT NULL CHECK (source IN ('ai', 'manual'))
- **created_at**: TIMESTAMPTZ NOT NULL DEFAULT NOW()
- **updated_at**: TIMESTAMPTZ NOT NULL DEFAULT NOW()

### 1.3. tags
- **id**: BIGSERIAL PRIMARY KEY
- **flashcard_id**: BIGINT NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE
- **tag**: VARCHAR(50) NOT NULL
- **created_at**: TIMESTAMPTZ NOT NULL DEFAULT NOW()
- **updated_at**: TIMESTAMPTZ NOT NULL DEFAULT NOW()
- **UNIQUE(flashcard_id, tag)** to prevent duplicate tags for the same flashcard

### 1.4. generation_session
- **id**: BIGSERIAL PRIMARY KEY
- **user_id**: UUID REFERENCES users(id) ON DELETE SET NULL
- **generation_duration**: INTERVAL NOT NULL
- **model**: VARCHAR(100) NOT NULL
- **created_at**: TIMESTAMPTZ NOT NULL DEFAULT NOW()
- **updated_at**: TIMESTAMPTZ NOT NULL DEFAULT NOW()

### 1.5. log_action
- **id**: BIGSERIAL PRIMARY KEY
- **user_id**: UUID REFERENCES users(id) ON DELETE SET NULL
- **generation_session_id**: BIGINT REFERENCES generation_session(id) ON DELETE SET NULL
- **flashcard_id**: BIGINT REFERENCES flashcards(id) ON DELETE SET NULL
- **action_type**: VARCHAR(10) NOT NULL CHECK (action_type IN ('accepted', 'edited', 'rejected'))
- **created_at**: TIMESTAMPTZ NOT NULL DEFAULT NOW()

### 1.6. generation_error
- **id**: BIGSERIAL PRIMARY KEY
- **session_id**: BIGINT NOT NULL REFERENCES generation_session(id) ON DELETE CASCADE
- **error_code**: VARCHAR(50) NOT NULL
- **error_message**: TEXT NOT NULL
- **created_at**: TIMESTAMPTZ NOT NULL DEFAULT NOW()

## 2. Relacje między tabelami

- **users** (1) --- (N) **flashcards**
  - Każdy użytkownik może posiadać wiele fiszek.

- **users** (1) --- (N) **generation_session**
  - Każdy użytkownik może posiadać wiele sesji generowania.

- **users** (1) --- (N) **log_action**
  - Każdy użytkownik może mieć wiele akcji logowanych.

- **flashcards** (1) --- (N) **tags**
  - Każda fiszka może mieć przypisane do 4 tagi (walidacja aplikacyjna).

- **generation_session** (1) --- (N) **log_action**
  - Sesja generowania może mieć wiele akcji logowanych.

- **flashcards** (1) --- (0..N) **log_action**
  - Logowane akcje mogą odnosić się do konkretnych fiszek.

- **generation_session** (1) --- (N) **generation_error**
  - Sesja generowania może mieć powiązane błędy.

## 3. Indeksy

- Unikalny indeks na kolumnie **email** w tabeli `users`:
  - CREATE UNIQUE INDEX idx_users_email ON users(email);

- Indeks na kolumnie **user_id** w tabeli `flashcards`:
  - CREATE INDEX idx_flashcards_user_id ON flashcards(user_id);

- Indeks na kolumnie **flashcard_id** w tabeli `tags`:
  - CREATE INDEX idx_tags_flashcard_id ON tags(flashcard_id);

- Indeks na kolumnie **user_id** w tabeli `generation_session`:
  - CREATE INDEX idx_generation_session_user_id ON generation_session(user_id);

- Indeks na kolumnie **user_id** w tabeli `log_action`:
  - CREATE INDEX idx_log_action_user_id ON log_action(user_id);

(Dodatkowe indeksy mogą być dodane w zależności od wzorców zapytań.)

## 4. Zasady PostgreSQL (Row-Level Security - RLS)

### Tabela flashcards
RLS zostanie włączone, aby ograniczyć dostęp do fiszek tylko do właściciela.

Przykładowa polityka:
```
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_flashcards_policy ON flashcards
    USING (user_id = current_setting('app.current_user_id')::uuid);
```

### Tabela generation_session
RLS zostanie włączone, aby ograniczyć dostęp do sesji generowania fiszek tylko do właściciela.

Przykładowa polityka:
```
ALTER TABLE generation_session ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_generation_session_policy ON generation_session
    USING (user_id = current_setting('app.current_user_id')::uuid);
```

### Tabela log_action
RLS zostanie włączone, aby ograniczyć dostęp do logów z akcji tylko do właściciela.

Przykładowa polityka:
```
ALTER TABLE log_action ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_log_action_policy ON log_action
    USING (user_id = current_setting('app.current_user_id')::uuid);;
```

## 5. Procedury składowane

### 5.1. log_flashcard_action
Procedura do logowania akcji na wygenerowanych fiszkach i tworzenia nowych fiszek.

```sql
create or replace function public.log_flashcard_action(
  p_session_id text,
  p_user_id text,
  p_action_type text,
  p_flashcard_data jsonb
) returns table (
  id bigint,
  session_id text,
  flashcard_id bigint,
  action_type text,
  created_at timestamptz
)
```

- **Parametry wejściowe:**
  - `p_session_id`: ID sesji generowania
  - `p_user_id`: ID użytkownika
  - `p_action_type`: Typ akcji ('accepted', 'edited', 'rejected')
  - `p_flashcard_data`: Dane fiszki w formacie JSON (dla akcji 'accepted' i 'edited')

- **Zwracane dane:**
  - `id`: ID utworzonego logu
  - `session_id`: ID sesji generowania
  - `flashcard_id`: ID utworzonej fiszki (dla akcji 'accepted' i 'edited')
  - `action_type`: Typ wykonanej akcji
  - `created_at`: Data utworzenia logu

- **Funkcjonalność:**
  - Używa transakcji do zapewnienia spójności danych
  - Tworzy nową fiszkę dla akcji 'accepted' i 'edited'
  - Loguje akcję w tabeli `log_action`
  - W przypadku błędu wykonuje rollback całej transakcji

## 6. Dodatkowe uwagi

- Wszystkie nazwy tabel i kolumn są w notacji snake_case.
- Walidacja maksymalnie 4 tagów przypisanych do fiszki będzie realizowana na poziomie aplikacji.
- Kolumny `created_at` i `updated_at` umożliwiają śledzenie zmian w rekordach.
- Schemat został zaprojektowany zgodnie z zasadami 3NF, z myślą o skalowalności i wydajności.
- Możliwość rozbudowy schematu w przyszłości przy użyciu migracji (Flyway, Liquibase) oraz wdrożenia pełnotekstowego wyszukiwania przy zaawansowanych operacjach. 