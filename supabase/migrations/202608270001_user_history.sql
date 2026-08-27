create table if not exists public.guided_runs (
  run_id text primary key,
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  revision integer not null default 1 check (revision > 0),
  outcome text not null check (outcome in ('IN_PROGRESS', 'HEALTHY', 'NEEDS_ATTENTION', 'BLOCKED', 'REVIEW_REQUIRED')),
  state jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists guided_runs_owner_updated_idx
  on public.guided_runs (owner_user_id, updated_at desc);

create table if not exists public.laboratory_sessions (
  session_id text primary key,
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  revision integer not null default 1 check (revision > 0),
  preset_id text not null,
  draft_version integer not null check (draft_version > 0),
  snapshot_version integer not null check (snapshot_version >= 0),
  outcome text not null check (outcome in ('NOT_RUN', 'HEALTHY', 'NEEDS_ATTENTION', 'REVIEW_REQUIRED', 'BLOCKED')),
  session jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists laboratory_sessions_owner_updated_idx
  on public.laboratory_sessions (owner_user_id, updated_at desc);

alter table public.guided_runs enable row level security;
alter table public.laboratory_sessions enable row level security;

revoke all on table public.guided_runs from anon, authenticated;
revoke all on table public.laboratory_sessions from anon, authenticated;
grant select, insert, update, delete on table public.guided_runs to authenticated;
grant select, insert, update, delete on table public.laboratory_sessions to authenticated;

drop policy if exists guided_runs_select_own on public.guided_runs;
create policy guided_runs_select_own on public.guided_runs
  for select to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = owner_user_id);

drop policy if exists guided_runs_insert_own on public.guided_runs;
create policy guided_runs_insert_own on public.guided_runs
  for insert to authenticated
  with check ((select auth.uid()) is not null and (select auth.uid()) = owner_user_id);

drop policy if exists guided_runs_update_own on public.guided_runs;
create policy guided_runs_update_own on public.guided_runs
  for update to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = owner_user_id)
  with check ((select auth.uid()) is not null and (select auth.uid()) = owner_user_id);

drop policy if exists guided_runs_delete_own on public.guided_runs;
create policy guided_runs_delete_own on public.guided_runs
  for delete to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = owner_user_id);

drop policy if exists laboratory_sessions_select_own on public.laboratory_sessions;
create policy laboratory_sessions_select_own on public.laboratory_sessions
  for select to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = owner_user_id);

drop policy if exists laboratory_sessions_insert_own on public.laboratory_sessions;
create policy laboratory_sessions_insert_own on public.laboratory_sessions
  for insert to authenticated
  with check ((select auth.uid()) is not null and (select auth.uid()) = owner_user_id);

drop policy if exists laboratory_sessions_update_own on public.laboratory_sessions;
create policy laboratory_sessions_update_own on public.laboratory_sessions
  for update to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = owner_user_id)
  with check ((select auth.uid()) is not null and (select auth.uid()) = owner_user_id);

drop policy if exists laboratory_sessions_delete_own on public.laboratory_sessions;
create policy laboratory_sessions_delete_own on public.laboratory_sessions
  for delete to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = owner_user_id);
