-- Migration: Initial schema setup
-- Description: Creates the initial database schema for the flashcard application
-- Tables: flashcards, tags, generation_session, log_action, generation_error

-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- Flashcards table
create table flashcards (
    id bigserial primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    front text not null,
    back text not null,
    phonetic text,
    source varchar(10) not null check (source in ('ai', 'manual')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Tags table
create table tags (
    id bigserial primary key,
    flashcard_id bigint not null references flashcards(id) on delete cascade,
    tag varchar(50) not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique(flashcard_id, tag)
);

-- Generation session table
create table generation_session (
    id bigserial primary key,
    user_id uuid references auth.users(id) on delete set null,
    generation_duration interval not null,
    model varchar(100) not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Log action table
create table log_action (
    id bigserial primary key,
    user_id uuid references auth.users(id) on delete set null,
    generation_session_id bigint references generation_session(id) on delete set null,
    flashcard_id bigint references flashcards(id) on delete set null,
    action_type varchar(10) not null check (action_type in ('accepted', 'edited', 'rejected')),
    created_at timestamptz not null default now()
);

-- Generation error table
create table generation_error (
    id bigserial primary key,
    session_id bigint not null references generation_session(id) on delete cascade,
    error_code varchar(50) not null,
    error_message text not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Create indexes
create index idx_flashcards_user_id on flashcards(user_id);
create index idx_tags_flashcard_id on tags(flashcard_id);
create index idx_generation_session_user_id on generation_session(user_id);
create index idx_log_action_user_id on log_action(user_id);

-- Enable Row Level Security
alter table flashcards enable row level security;
alter table tags enable row level security;
alter table generation_session enable row level security;
alter table log_action enable row level security;
alter table generation_error enable row level security;

-- RLS Policies for flashcards
create policy "Users can view their own flashcards" 
    on flashcards for select 
    using (auth.uid() = user_id);

create policy "Users can create their own flashcards" 
    on flashcards for insert 
    with check (auth.uid() = user_id);

create policy "Users can update their own flashcards" 
    on flashcards for update 
    using (auth.uid() = user_id);

create policy "Users can delete their own flashcards" 
    on flashcards for delete 
    using (auth.uid() = user_id);

-- RLS Policies for tags
create policy "Users can view tags of their flashcards" 
    on tags for select 
    using (exists (
        select 1 from flashcards 
        where flashcards.id = tags.flashcard_id 
        and flashcards.user_id = auth.uid()
    ));

create policy "Users can create tags for their flashcards" 
    on tags for insert 
    with check (exists (
        select 1 from flashcards 
        where flashcards.id = flashcard_id 
        and flashcards.user_id = auth.uid()
    ));

create policy "Users can update tags of their flashcards" 
    on tags for update 
    using (exists (
        select 1 from flashcards 
        where flashcards.id = tags.flashcard_id 
        and flashcards.user_id = auth.uid()
    ));

create policy "Users can delete tags of their flashcards" 
    on tags for delete 
    using (exists (
        select 1 from flashcards 
        where flashcards.id = tags.flashcard_id 
        and flashcards.user_id = auth.uid()
    ));

-- RLS Policies for generation_session
create policy "Users can view their own generation sessions" 
    on generation_session for select 
    using (auth.uid() = user_id);

create policy "Users can create their own generation sessions" 
    on generation_session for insert 
    with check (auth.uid() = user_id);

-- RLS Policies for log_action
create policy "Users can view their own log actions" 
    on log_action for select 
    using (auth.uid() = user_id);

create policy "Users can create their own log actions" 
    on log_action for insert 
    with check (auth.uid() = user_id);

-- RLS Policies for generation_error
create policy "Users can view errors from their sessions" 
    on generation_error for select 
    using (exists (
        select 1 from generation_session 
        where generation_session.id = session_id 
        and generation_session.user_id = auth.uid()
    ));

create policy "Users can create error logs for their sessions" 
    on generation_error for insert 
    with check (exists (
        select 1 from generation_session 
        where generation_session.id = session_id 
        and generation_session.user_id = auth.uid()
    )); 