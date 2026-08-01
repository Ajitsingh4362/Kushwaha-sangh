-- Run this once in Supabase SQL Editor (Project -> SQL Editor -> New query)

create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'Other',
  program_date date not null,
  location text,
  description text,
  participant_count integer,
  participants jsonb not null default '[]'::jsonb,   -- [{ "name": "...", "detail": "..." }]
  photos jsonb not null default '[]'::jsonb,          -- ["https://...", ...]
  video_url text,
  created_at timestamptz not null default now()
);

alter table public.programs enable row level security;

-- Anyone (including logged-out visitors) can read programs — needed for the public Programs page.
create policy "Public can view programs"
  on public.programs for select
  using (true);

-- Only logged-in admins (Supabase auth users) can add/edit/delete.
create policy "Authenticated users can insert programs"
  on public.programs for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update programs"
  on public.programs for update
  to authenticated
  using (true);

create policy "Authenticated users can delete programs"
  on public.programs for delete
  to authenticated
  using (true);

-- Realtime (so the admin panel and public page update live, matching the rest of the site)
alter publication supabase_realtime add table public.programs;

-- Storage bucket for program photos (same pattern as gallery-photos)
insert into storage.buckets (id, name, public)
values ('program-photos', 'program-photos', true)
on conflict (id) do nothing;

create policy "Public can view program photos"
  on storage.objects for select
  using (bucket_id = 'program-photos');

create policy "Authenticated users can upload program photos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'program-photos');

create policy "Authenticated users can delete program photos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'program-photos');
