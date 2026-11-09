-- Public member directory (the "सदस्य" page on the website, /community).
-- Run this once in Supabase: Project -> SQL Editor -> New query -> paste -> Run.
--
-- The members table stays private (RLS: committee only). This function
-- hands the public website ONLY the name, membership type and joining
-- date of each active member — never phone, email or address.

create or replace function public.get_public_members()
returns table (name text, member_type text, joined_on date)
language sql
stable
security definer
set search_path = public
as $$
  select
    m.name::text,
    m.member_type::text,
    m.created_at::date
  from public.members m
  where coalesce(m.active, true)
  order by m.created_at asc, m.name asc;
$$;

revoke all on function public.get_public_members() from public;
grant execute on function public.get_public_members() to anon, authenticated;
