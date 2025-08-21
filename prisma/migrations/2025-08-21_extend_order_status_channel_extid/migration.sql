
-- Add status/channel/externalId on Order
ALTER TABLE "Order"
  ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS "channel" TEXT,
  ADD COLUMN IF NOT EXISTS "externalId" TEXT;

-- Index to query by status and time
CREATE INDEX IF NOT EXISTS "Order_status_createdAt_idx" ON "Order" ("status","createdAt");
