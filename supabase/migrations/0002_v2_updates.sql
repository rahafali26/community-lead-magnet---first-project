-- V2 schema updates for the 7-question audit.
--
-- Fully additive: every change is `add column if not exists`. Old V1 columns
-- (content_answers, business_answers, problems, time_value) are left in place, untouched and
-- unused by the new code, rather than dropped or renamed — avoids any destructive change and
-- keeps this safe to apply even after the fact.

alter table submissions
  add column if not exists language text not null default 'ar' check (language in ('ar', 'en')),
  add column if not exists content_volume jsonb,
  add column if not exists time_breakdown jsonb,
  add column if not exists pain_points jsonb,
  add column if not exists vanish_task text,
  add column if not exists time_value_answers jsonb,
  add column if not exists primary_platform_other_text text;

-- account_url and primary_platform are now REQUIRED at the application layer (Lead Capture
-- validation). Not enforced with `not null` here to avoid breaking any existing rows that
-- predate this requirement — enforced in `lib/validation/auditSchema.ts` instead.
