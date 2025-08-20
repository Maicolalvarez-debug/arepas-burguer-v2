-- Add columns if they don't exist
ALTER TABLE "Category"         ADD COLUMN IF NOT EXISTS "sortOrder" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Product"          ADD COLUMN IF NOT EXISTS "sortOrder" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Modifier"         ADD COLUMN IF NOT EXISTS "sortOrder" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "ProductModifier"  ADD COLUMN IF NOT EXISTS "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- Seed initial order values (0-based) based on current records
WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY id) - 1 AS rn
  FROM "Category"
)
UPDATE "Category" c
SET "sortOrder" = r.rn
FROM ranked r
WHERE c.id = r.id;

WITH ranked AS (
  SELECT id, "categoryId",
         ROW_NUMBER() OVER (PARTITION BY "categoryId" ORDER BY id) - 1 AS rn
  FROM "Product"
)
UPDATE "Product" p
SET "sortOrder" = r.rn
FROM ranked r
WHERE p.id = r.id;

WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY id) - 1 AS rn
  FROM "Modifier"
)
UPDATE "Modifier" m
SET "sortOrder" = r.rn
FROM ranked r
WHERE m.id = r.id;

WITH ranked AS (
  SELECT "productId","modifierId",
         ROW_NUMBER() OVER (
           PARTITION BY "productId"
           ORDER BY "modifierId"
         ) - 1 AS rn
  FROM "ProductModifier"
)
UPDATE "ProductModifier" pm
SET "sortOrder" = r.rn
FROM ranked r
WHERE pm."productId" = r."productId" AND pm."modifierId" = r."modifierId";
