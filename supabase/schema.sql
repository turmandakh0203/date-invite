-- ============================================================
-- Аяллын төлөвлөгөө — Supabase Schema
-- Supabase Dashboard > SQL Editor дээр оруулаарай
-- ============================================================

-- 1. Trips
create table public.trips (
  id          uuid        default gen_random_uuid() primary key,
  user_id     uuid        references auth.users(id) on delete cascade not null,
  created_at  timestamptz default now() not null,
  trip_date   text        not null,
  days        int         not null,
  start_time  text        not null,
  acts        text[]      not null default '{}',
  route       text        not null default '',
  itinerary   text[]      not null default '{}',
  packing     text[]      not null default '{}'
);

-- 2. Journal entries (нэг trip-д нэг өдөрт нэг entry)
create table public.journal_entries (
  id          uuid        default gen_random_uuid() primary key,
  trip_id     uuid        references public.trips(id) on delete cascade not null,
  user_id     uuid        references auth.users(id) on delete cascade not null,
  day_index   int         not null,
  note        text        not null default '',
  mood        text        not null default '',
  updated_at  timestamptz default now() not null,
  unique(trip_id, day_index)
);

-- 3. Photos (Supabase Storage-г заасан path)
create table public.photos (
  id           uuid        default gen_random_uuid() primary key,
  entry_id     uuid        references public.journal_entries(id) on delete cascade not null,
  user_id      uuid        references auth.users(id) on delete cascade not null,
  storage_path text        not null,
  created_at   timestamptz default now() not null
);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================
alter table public.trips           enable row level security;
alter table public.journal_entries enable row level security;
alter table public.photos          enable row level security;

-- Trips: өөрийн trips-г бүгдийг хийж болно
create policy "trips_own" on public.trips
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Journal entries: өөрийн entries
create policy "journal_own" on public.journal_entries
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Photos: өөрийн photos
create policy "photos_own" on public.photos
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- Storage bucket (Dashboard > Storage дээр ч хийж болно)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('trip-photos', 'trip-photos', true)
on conflict do nothing;

-- Storage policy: {userId}/... folder-т өөрөө л бичиж унших боломжтой
create policy "storage_own" on storage.objects
  for all
  using  (bucket_id = 'trip-photos' and auth.uid()::text = (storage.foldername(name))[1])
  with check (bucket_id = 'trip-photos' and auth.uid()::text = (storage.foldername(name))[1]);
