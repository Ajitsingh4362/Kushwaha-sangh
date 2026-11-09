-- Unique member IDs: sks_1000, sks_1001, sks_1002 …
-- Run once in Supabase: Project -> SQL Editor -> New query -> paste -> Run.
-- Safe to run again: existing IDs are kept, only members without one get the next number.

-- 1. Counter for new IDs
create sequence if not exists public.member_code_seq;

-- 2. New column on members
alter table public.members add column if not exists member_code text;

-- 3. Give existing members IDs in the order they joined (oldest = sks_1000)
do $$
declare
  base int;
begin
  select coalesce(max(substring(member_code from 5)::int), 999) into base
  from public.members where member_code ~ '^sks_[0-9]+$';

  with ordered as (
    select id, row_number() over (order by created_at, id) as rn
    from public.members where member_code is null
  )
  update public.members m
  set member_code = 'sks_' || (base + ordered.rn)
  from ordered where m.id = ordered.id;

  -- continue the counter after the highest ID handed out
  perform setval(
    'public.member_code_seq',
    coalesce((select max(substring(member_code from 5)::int) from public.members where member_code ~ '^sks_[0-9]+$'), 999),
    true
  );
end $$;

-- 4. Every new member (admin panel or approved website application) gets the next ID automatically
alter table public.members alter column member_code set default 'sks_' || nextval('public.member_code_seq');
alter table public.members alter column member_code set not null;
create unique index if not exists members_member_code_key on public.members (member_code);
grant usage, select on sequence public.member_code_seq to authenticated;

-- 5. Public member list for the website now also returns the ID
drop function if exists public.get_public_members();

create function public.get_public_members()
returns table (member_code text, name text, member_type text, occupation text)
language sql
stable
security definer
set search_path = public
as $$
  select m.member_code::text, m.name::text, m.member_type::text, m.occupation::text
  from public.members m
  where coalesce(m.active, true)
  order by m.created_at asc, m.name asc;
$$;

revoke all on function public.get_public_members() from public;
grant execute on function public.get_public_members() to anon, authenticated;
