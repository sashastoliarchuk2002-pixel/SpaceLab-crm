-- Run this once in your Supabase project: Dashboard → SQL Editor → New query → paste → Run

create table if not exists kv_store (
  key text primary key,
  value text not null,
  updated_at timestamptz default now()
);

-- Row Level Security: since this is an internal team tool without user accounts,
-- we allow the public "anon" key (used by the app) to read/write this one table.
-- This is fine for a small internal CRM, but it does mean anyone with your
-- Supabase URL + anon key could read/write this table directly (not just via the app).
alter table kv_store enable row level security;

create policy "Allow anon read" on kv_store
  for select using (true);

create policy "Allow anon write" on kv_store
  for insert with check (true);

create policy "Allow anon update" on kv_store
  for update using (true);

create policy "Allow anon delete" on kv_store
  for delete using (true);
