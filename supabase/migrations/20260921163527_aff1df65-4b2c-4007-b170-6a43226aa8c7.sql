create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  publish_date timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.takes (
  id uuid primary key default gen_random_uuid(),
  program_id uuid references public.programs(id) on delete cascade not null,
  number integer not null default 1,
  date timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.songs (
  id uuid primary key default gen_random_uuid(),
  take_id uuid references public.takes(id) on delete cascade not null,
  title text not null default '',
  artist text,
  news text not null default '',
  production_date timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, insert, update, delete on public.programs to authenticated;
grant select, insert, update, delete on public.takes to authenticated;
grant select, insert, update, delete on public.songs to authenticated;
grant all on public.programs, public.takes, public.songs to service_role;