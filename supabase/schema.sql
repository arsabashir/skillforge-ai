-- Run this in the Supabase SQL editor before enabling persistence.
create table if not exists public.learning_roadmaps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  topic text not null,
  overview text not null,
  modules jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  module_id text not null,
  module_title text not null,
  score integer not null check (score >= 0),
  total_questions integer not null check (total_questions > 0),
  created_at timestamptz not null default now()
);

create table if not exists public.weak_spots (
  user_id uuid not null references auth.users(id) on delete cascade,
  module_id text not null,
  concept text not null,
  missed_question_ids text[] not null default '{}',
  last_missed_at timestamptz not null default now(),
  primary key (user_id, module_id, concept)
);

create table if not exists public.tutor_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  module_id text not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.learning_roadmaps enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.weak_spots enable row level security;
alter table public.tutor_messages enable row level security;

create policy "Users manage their own roadmaps" on public.learning_roadmaps for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage their own quiz attempts" on public.quiz_attempts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage their own weak spots" on public.weak_spots for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage their own tutor messages" on public.tutor_messages for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
