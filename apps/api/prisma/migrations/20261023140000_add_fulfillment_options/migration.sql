ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'completed';
CREATE TYPE "FulfillmentMethod" AS ENUM ('delivery', 'pickup');

ALTER TABLE "Order"
ADD COLUMN "fulfillmentMethod" "FulfillmentMethod" NOT NULL DEFAULT 'delivery',
ADD COLUMN "fulfillmentLocation" TEXT NOT NULL DEFAULT '';

UPDATE "Order"
SET "fulfillmentLocation" = concat_ws(', ',
  NULLIF("shippingAddress"->>'line1', ''),
  NULLIF("shippingAddress"->>'city', ''),
  NULLIF("shippingAddress"->>'country', '')
)
WHERE "shippingAddress" IS NOT NULL;

ALTER TABLE "StoreSettings"
ADD COLUMN "pickupLocations" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

UPDATE "StoreSettings"
SET "pickupLocations" = ARRAY['JustBuy Osu Pickup Point']
WHERE "id" = 'store_settings' AND cardinality("pickupLocations") = 0;