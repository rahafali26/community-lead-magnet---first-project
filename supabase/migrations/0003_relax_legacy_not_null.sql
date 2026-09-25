-- Fixes a real blocker discovered during the first live V2 submission test: the original V1
-- migration (0001) left NOT NULL constraints on `content_answers`, `problems`, and `time_value`.
-- The V2 app no longer writes to these columns (replaced by `content_volume` + `time_breakdown`,
-- `pain_points`, and `time_value_answers` respectively, added in 0002), so every new insert was
-- failing with: null value in column "content_answers" violates not-null constraint.
--
-- This only relaxes the constraint — it does not drop the columns or touch any existing data.
-- Old rows (if any) keep whatever values they already had.

alter table submissions
  alter column content_answers drop not null,
  alter column problems drop not null,
  alter column time_value drop not null;
