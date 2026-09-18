-- Content & Business Time Audit — Schema أولي
-- شغّليه في Supabase Dashboard → SQL Editor

create extension if not exists pgcrypto;

create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- بيانات المستخدم (Gated Form)
  name text not null,
  email text not null,
  account_url text,
  primary_platform text,

  user_type text not null check (user_type in ('creator', 'creator_business')),

  -- موافقات
  data_consent boolean not null default false,
  marketing_consent boolean not null default false,

  -- إجابات (JSON مرنة لسهولة التوسع بدون migration)
  content_answers jsonb not null,
  business_answers jsonb,
  problems jsonb not null,
  ai_usage jsonb not null,
  time_value text not null,

  -- نتائج محسوبة وقت الإرسال (snapshot)
  results jsonb not null
);

create index if not exists submissions_created_at_idx on submissions (created_at desc);
create index if not exists submissions_user_type_idx on submissions (user_type);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  session_id text not null,
  event_name text not null,
  submission_id uuid references submissions(id) on delete set null,
  metadata jsonb
);

create index if not exists events_event_name_idx on events (event_name);
create index if not exists events_session_id_idx on events (session_id);

-- Row Level Security
alter table submissions enable row level security;
alter table events enable row level security;

-- anon key يقدر يضيف بس، ما يقدر يقرأ ولا يعدّل ولا يحذف
create policy "anon can insert submissions"
  on submissions for insert
  to anon
  with check (true);

create policy "anon can insert events"
  on events for insert
  to anon
  with check (true);

-- لا توجد سياسات SELECT/UPDATE/DELETE لـ anon أو authenticated عمدًا.
-- القراءة (لوحة الإدارة) تتم فقط عبر service_role key من السيرفر، وهو يتجاوز RLS تلقائيًا.
