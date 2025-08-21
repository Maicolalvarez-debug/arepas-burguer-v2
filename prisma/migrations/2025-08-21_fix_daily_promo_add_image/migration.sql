
-- Ensure image column exists on DailyPromo (some DBs may have been created earlier without it)
ALTER TABLE "DailyPromo"
  ADD COLUMN IF NOT EXISTS "image" TEXT;
