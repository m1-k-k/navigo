-- NaviGo Supabase Schema
-- Run this in your Supabase SQL editor

create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  night_mode_auto boolean default true,
  premium boolean default false,
  created_at timestamptz default now()
);

create table if not exists saved_routes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  origin jsonb not null,
  destination jsonb not null,
  mode text check (mode in ('fast', 'safe')) not null,
  polyline jsonb,
  created_at timestamptz default now()
);

create table if not exists hazard_reports (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete set null,
  lat double precision not null,
  lng double precision not null,
  description text not null,
  category text default 'other',
  photo_url text,
  status text default 'pending' check (status in ('pending', 'submitted', 'resolved')),
  created_at timestamptz default now()
);

alter table profiles enable row level security;
alter table saved_routes enable row level security;
alter table hazard_reports enable row level security;

create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on profiles
  for insert with check (auth.uid() = id);

create policy "Users can view own routes" on saved_routes
  for select using (auth.uid() = user_id);

create policy "Users can insert own routes" on saved_routes
  for insert with check (auth.uid() = user_id);

create policy "Users can view own reports" on hazard_reports
  for select using (auth.uid() = user_id);

create policy "Users can insert reports" on hazard_reports
  for insert with check (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
