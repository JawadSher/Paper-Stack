-- Grants required for Supabase PostgREST anon access.
-- Run this in Supabase SQL Editor.

grant usage on schema public to anon, authenticated;

grant select on all tables in schema public to anon, authenticated;

grant execute on all functions in schema public to anon, authenticated;

alter default privileges in schema public
grant select on tables to anon, authenticated;

alter default privileges in schema public
grant execute on functions to anon, authenticated;
