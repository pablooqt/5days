-- 5days Phase 5 / P5-2
-- Core relational schema. Device writes remain RPC-only until P5-5.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'viewer'
    constraint profiles_role_check check (role in ('viewer', 'operator', 'admin')),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.buildings (
  id text primary key,
  name text not null,
  config jsonb not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.floors (
  id text primary key,
  building_id text not null references public.buildings(id) on delete cascade,
  idx integer not null,
  name text not null,
  elevation numeric not null,
  constraint floors_building_idx_unique unique (building_id, idx)
);

create table if not exists public.rooms (
  id text primary key,
  floor_id text not null references public.floors(id) on delete cascade,
  name text not null,
  type text not null
    constraint rooms_type_check check (type in ('office', 'meeting', 'lobby', 'utility', 'corridor')),
  position jsonb not null,
  width numeric not null check (width > 0),
  depth numeric not null check (depth > 0),
  height numeric not null check (height > 0),
  status text not null default 'vacant'
    constraint rooms_status_check check (status in ('occupied', 'vacant', 'warning', 'offline'))
);

create table if not exists public.devices (
  id text primary key,
  building_id text not null references public.buildings(id) on delete cascade,
  floor_id text not null references public.floors(id) on delete cascade,
  room_id text references public.rooms(id) on delete set null,
  type text not null
    constraint devices_type_check check (type in ('ac', 'light', 'door', 'elevator', 'cctv', 'sensor')),
  name text not null,
  position jsonb not null,
  rotation_y numeric not null default 0,
  capabilities text[] not null default '{}',
  metadata jsonb not null default '{}'
);

create table if not exists public.device_states (
  device_id text primary key references public.devices(id) on delete cascade,
  state jsonb not null default '{}',
  updated_at timestamptz not null default timezone('utc', now()),
  updated_by uuid references auth.users(id) on delete set null
);

create table if not exists public.device_events (
  id bigint generated always as identity primary key,
  device_id text not null references public.devices(id) on delete cascade,
  event_type text not null
    constraint device_events_type_check check (event_type in ('state_change', 'command', 'alert')),
  payload jsonb not null default '{}',
  actor uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  actor uuid references auth.users(id) on delete set null,
  action text not null,
  target text,
  payload jsonb not null default '{}',
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists floors_building_id_idx on public.floors(building_id);
create index if not exists rooms_floor_id_idx on public.rooms(floor_id);
create index if not exists devices_building_id_idx on public.devices(building_id);
create index if not exists devices_floor_id_idx on public.devices(floor_id);
create index if not exists devices_room_id_idx on public.devices(room_id);
create index if not exists device_events_device_created_idx on public.device_events(device_id, created_at desc);
create index if not exists device_events_created_idx on public.device_events(created_at desc);
create index if not exists audit_logs_created_idx on public.audit_logs(created_at desc);

create or replace function public.is_role(required_role text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = required_role
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.buildings enable row level security;
alter table public.floors enable row level security;
alter table public.rooms enable row level security;
alter table public.devices enable row level security;
alter table public.device_states enable row level security;
alter table public.device_events enable row level security;
alter table public.audit_logs enable row level security;

drop policy if exists profiles_self_read on public.profiles;
create policy profiles_self_read on public.profiles
  for select to authenticated
  using (id = auth.uid());

drop policy if exists buildings_authenticated_read on public.buildings;
create policy buildings_authenticated_read on public.buildings
  for select to authenticated using (true);

drop policy if exists floors_authenticated_read on public.floors;
create policy floors_authenticated_read on public.floors
  for select to authenticated using (true);

drop policy if exists rooms_authenticated_read on public.rooms;
create policy rooms_authenticated_read on public.rooms
  for select to authenticated using (true);

drop policy if exists devices_authenticated_read on public.devices;
create policy devices_authenticated_read on public.devices
  for select to authenticated using (true);

drop policy if exists device_states_authenticated_read on public.device_states;
create policy device_states_authenticated_read on public.device_states
  for select to authenticated using (true);

drop policy if exists device_events_authenticated_read on public.device_events;
create policy device_events_authenticated_read on public.device_events
  for select to authenticated using (true);

drop policy if exists audit_logs_admin_read on public.audit_logs;
create policy audit_logs_admin_read on public.audit_logs
  for select to authenticated
  using (public.is_role('admin'));

-- No direct INSERT/UPDATE/DELETE policies are intentional in this migration.
-- Seed/admin/RPC write paths are introduced in later Phase 5 tasks.
