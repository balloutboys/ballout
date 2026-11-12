-- Published artifacts for Ballout Boys
create table if not exists public.artifacts (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  description text,
  url         text,          -- link to the hosted artifact (e.g. claude.ai artifact link)
  content     text,          -- optional inline HTML/markdown
  published   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.artifacts enable row level security;

-- Anyone can read published artifacts; writes need the service role or an authenticated user.
create policy "Public can read published artifacts"
  on public.artifacts for select
  using (published = true);

create policy "Authenticated users can manage artifacts"
  on public.artifacts for all
  to authenticated
  using (true) with check (true);
