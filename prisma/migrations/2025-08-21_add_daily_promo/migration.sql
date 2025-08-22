
-- Create DailyPromo table if missing
CREATE TABLE IF NOT EXISTS "DailyPromo" (
  "id" SERIAL PRIMARY KEY,
  "active" BOOLEAN NOT NULL DEFAULT TRUE,
  "startDate" TIMESTAMP NULL,
  "endDate" TIMESTAMP NULL,
  "title" TEXT NULL,
  "description" TEXT NULL,
  "image" TEXT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS "DailyPromo_active_idx" ON "DailyPromo" ("active");
CREATE INDEX IF NOT EXISTS "DailyPromo_startDate_idx" ON "DailyPromo" ("startDate");
CREATE INDEX IF NOT EXISTS "DailyPromo_endDate_idx" ON "DailyPromo" ("endDate");

-- Trigger to emulate @updatedAt (optional - Prisma usually sets value; left as default here)
