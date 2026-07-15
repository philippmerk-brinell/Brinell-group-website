-- =============================================================================
-- Aeternum Data Platform — Migration 001
-- Ausführen im Supabase SQL Editor (oder via psql) im Schema `public`.
-- Idempotent: kann gefahrlos mehrfach ausgeführt werden.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Oura: Schlaf (ein Datensatz pro Schlafphase, inkl. Naps — Typ steht in raw)
-- ---------------------------------------------------------------------------
create table if not exists oura_sleep (
  id text primary key,
  day date not null,
  average_hrv numeric,
  average_heart_rate numeric,
  lowest_heart_rate numeric,
  total_sleep_duration int,
  deep_sleep_duration int,
  rem_sleep_duration int,
  efficiency numeric,
  bedtime_start timestamptz,
  bedtime_end timestamptz,
  raw jsonb not null,
  synced_at timestamptz default now()
);
create index if not exists oura_sleep_day_idx on oura_sleep (day);

-- ---------------------------------------------------------------------------
-- Oura: Daily Readiness (contributors in raw)
-- ---------------------------------------------------------------------------
create table if not exists oura_daily_readiness (
  id text primary key,
  day date not null,
  score numeric,
  temperature_deviation numeric,
  raw jsonb not null,
  synced_at timestamptz default now()
);
create index if not exists oura_daily_readiness_day_idx on oura_daily_readiness (day);

-- ---------------------------------------------------------------------------
-- Oura: Daily Activity
-- ---------------------------------------------------------------------------
create table if not exists oura_daily_activity (
  id text primary key,
  day date not null,
  score numeric,
  steps int,
  active_calories int,
  total_calories int,
  raw jsonb not null,
  synced_at timestamptz default now()
);
create index if not exists oura_daily_activity_day_idx on oura_daily_activity (day);

-- ---------------------------------------------------------------------------
-- Oura: Daily Resilience (contributors in raw)
-- ---------------------------------------------------------------------------
create table if not exists oura_daily_resilience (
  id text primary key,
  day date not null,
  level text,
  raw jsonb not null,
  synced_at timestamptz default now()
);
create index if not exists oura_daily_resilience_day_idx on oura_daily_resilience (day);

-- ---------------------------------------------------------------------------
-- Oura: Daily SpO2
-- ---------------------------------------------------------------------------
create table if not exists oura_daily_spo2 (
  id text primary key,
  day date not null,
  spo2_avg numeric,
  breathing_disturbance_index numeric,
  raw jsonb not null,
  synced_at timestamptz default now()
);
create index if not exists oura_daily_spo2_day_idx on oura_daily_spo2 (day);

-- ---------------------------------------------------------------------------
-- Oura: Daily Stress
-- ---------------------------------------------------------------------------
create table if not exists oura_daily_stress (
  id text primary key,
  day date not null,
  stress_high int,
  recovery_high int,
  day_summary text,
  raw jsonb not null,
  synced_at timestamptz default now()
);
create index if not exists oura_daily_stress_day_idx on oura_daily_stress (day);

-- ---------------------------------------------------------------------------
-- Oura: Workouts
-- ---------------------------------------------------------------------------
create table if not exists oura_workouts (
  id text primary key,
  day date not null,
  activity text,
  intensity text,
  calories numeric,
  distance numeric,
  start_datetime timestamptz,
  end_datetime timestamptz,
  raw jsonb not null,
  synced_at timestamptz default now()
);
create index if not exists oura_workouts_day_idx on oura_workouts (day);

-- ---------------------------------------------------------------------------
-- Oura: Sessions (Meditation, Atemübungen, Naps via Moment-Feature)
-- ---------------------------------------------------------------------------
create table if not exists oura_sessions (
  id text primary key,
  day date not null,
  type text,
  start_datetime timestamptz,
  end_datetime timestamptz,
  mood text,
  raw jsonb not null,
  synced_at timestamptz default now()
);
create index if not exists oura_sessions_day_idx on oura_sessions (day);

-- ---------------------------------------------------------------------------
-- Oura: Tags (Enhanced Tags)
-- ---------------------------------------------------------------------------
create table if not exists oura_tags (
  id text primary key,
  day date not null,
  tag_type_code text,
  comment text,
  start_time timestamptz,
  end_time timestamptz,
  raw jsonb not null,
  synced_at timestamptz default now()
);
create index if not exists oura_tags_day_idx on oura_tags (day);

-- ---------------------------------------------------------------------------
-- Oura: VO2max
-- ---------------------------------------------------------------------------
create table if not exists oura_vo2max (
  id text primary key,
  day date not null,
  vo2_max numeric,
  raw jsonb not null,
  synced_at timestamptz default now()
);
create index if not exists oura_vo2max_day_idx on oura_vo2max (day);

-- ---------------------------------------------------------------------------
-- Oura: Cardiovascular Age (liefert keine eigene id → PK = day)
-- ---------------------------------------------------------------------------
create table if not exists oura_cardio_age (
  day date primary key,
  vascular_age numeric,
  raw jsonb not null,
  synced_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- Zukünftige Quellen: Blutwerte (manuelle Imports / Lab-PDF-Parsing)
-- ---------------------------------------------------------------------------
create table if not exists bloodwork (
  id bigint generated by default as identity primary key,
  drawn_at date not null,
  marker text not null,
  value numeric,
  unit text,
  ref_low numeric,
  ref_high numeric,
  lab text,
  raw jsonb not null default '{}'::jsonb
);
create index if not exists bloodwork_drawn_at_idx on bloodwork (drawn_at);
create index if not exists bloodwork_marker_idx on bloodwork (marker);

-- ---------------------------------------------------------------------------
-- Zukünftige Quellen: externe Workouts (FITIV, Apple Health / AirPods)
-- ---------------------------------------------------------------------------
create table if not exists workouts_external (
  id text primary key,
  source text not null,
  start timestamptz not null,
  duration_s int,
  avg_hr numeric,
  max_hr numeric,
  distance_m numeric,
  raw jsonb not null default '{}'::jsonb
);
create index if not exists workouts_external_start_idx on workouts_external (start);

-- ---------------------------------------------------------------------------
-- View für die Trainingsampel: eine Zeile pro Tag.
-- Bei mehreren Schlafphasen pro Tag gewinnt der Haupt-Schlaf (long_sleep,
-- längste Dauer), damit Naps die HRV-/RHR-Werte nicht verfälschen.
-- ---------------------------------------------------------------------------
create or replace view daily_summary as
with main_sleep as (
  select distinct on (day) *
  from oura_sleep
  where coalesce(raw ->> 'type', 'long_sleep') = 'long_sleep'
  order by day, total_sleep_duration desc nulls last
)
select
  s.day,
  s.average_hrv        as hrv,
  s.lowest_heart_rate  as rhr,
  r.score              as readiness,
  a.steps,
  a.active_calories,
  res.level            as resilience,
  c.vascular_age
from main_sleep s
left join oura_daily_readiness  r   using (day)
left join oura_daily_activity   a   using (day)
left join oura_daily_resilience res using (day)
left join oura_cardio_age       c   using (day);
