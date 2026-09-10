-- Git Lantern Supabase Database Schema
-- Row Level Security (RLS) is strictly enabled on every table.
-- Users can only read and write their own records.

create table if not exists profiles (
  userId uuid primary key references auth.users on delete cascade,
  email text not null,
  displayName text,
  avatarUrl text,
  createdAt timestamp with time zone default now()
);

alter table profiles enable row level security;

create policy "usersCanSelectOwnProfile"
  on profiles for select
  using (auth.uid() = userId);

create policy "usersCanInsertOwnProfile"
  on profiles for insert
  with check (auth.uid() = userId);

create policy "usersCanUpdateOwnProfile"
  on profiles for update
  using (auth.uid() = userId);

create policy "usersCanDeleteOwnProfile"
  on profiles for delete
  using (auth.uid() = userId);

create table if not exists commandHistory (
  id text primary key default md5(random()::text || now()::text),
  userId uuid not null references auth.users on delete cascade,
  command text not null,
  explanation text,
  source text not null,
  createdAt timestamp with time zone default now()
);

alter table commandHistory enable row level security;

create policy "usersCanSelectOwnHistory"
  on commandHistory for select
  using (auth.uid() = userId);

create policy "usersCanInsertOwnHistory"
  on commandHistory for insert
  with check (auth.uid() = userId);

create policy "usersCanDeleteOwnHistory"
  on commandHistory for delete
  using (auth.uid() = userId);

create table if not exists badges (
  id text primary key default md5(random()::text || now()::text),
  userId uuid not null references auth.users on delete cascade,
  badgeId text not null,
  title text not null,
  unlockedAt timestamp with time zone default now()
);

alter table badges enable row level security;

create policy "usersCanSelectOwnBadges"
  on badges for select
  using (auth.uid() = userId);

create policy "usersCanInsertOwnBadges"
  on badges for insert
  with check (auth.uid() = userId);

create policy "usersCanDeleteOwnBadges"
  on badges for delete
  using (auth.uid() = userId);
