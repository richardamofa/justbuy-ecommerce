INSERT INTO "Product" (
    "id", "name", "slug", "description", "shortDescription", "price", "currency", "sku",
    "categoryId", "tags", "stock", "lowStockThreshold", "trackInventory", "isFeatured",
    "isBestSeller", "isNewArrival", "visibility", "seoTitle", "seoDescription", "createdAt", "updatedAt"
)
SELECT
    'demo-market-tote-001',
    'Handwoven Market Tote',
    'handwoven-market-tote',
    'A roomy everyday tote made from sturdy cotton canvas with handwoven handles. The 38 × 34 × 12 cm body fits a light jacket, groceries, or a 13-inch laptop. Choose Natural or Olive. Spot clean with a damp cloth and air dry. Each piece is finished in small batches, so subtle weave variations are part of its character.',
    'Small-batch canvas tote with handwoven handles.',
    260.00,
    'GHS',
    'JB-ACC-TOT-001',
    (SELECT "id" FROM "Category" WHERE "slug" = 'accessories' LIMIT 1),
    ARRAY['accessories', 'bags', 'canvas', 'handwoven', 'everyday'],
    30,
    5,
    true,
    true,
    true,
    true,
    'visible',
    'Handwoven Market Tote | JustBuy',
    'A durable small-batch cotton canvas tote in Natural or Olive.',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM "Product" WHERE "slug" = 'handwoven-market-tote'
);

INSERT INTO "ProductImage" ("id", "productId", "url", "alt", "position")
SELECT 'demo-market-tote-image-1', "id",
       'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=80',
       'Handwoven market tote in natural canvas', 0
FROM "Product" WHERE "slug" = 'handwoven-market-tote'
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ProductImage" ("id", "productId", "url", "alt", "position")
SELECT 'demo-market-tote-image-2', "id",
       'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80',
       'Market tote shown with everyday essentials', 1
FROM "Product" WHERE "slug" = 'handwoven-market-tote'
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ProductOption" ("id", "productId", "name", "values")
SELECT 'demo-market-tote-option-color', "id", 'Color', ARRAY['Natural', 'Olive']
FROM "Product" WHERE "slug" = 'handwoven-market-tote'
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ProductVariant" ("id", "productId", "sku", "options", "stock", "imageUrl", "isDefault")
SELECT 'demo-market-tote-variant-natural', "id", 'JB-ACC-TOT-001-NAT', '{"Color":"Natural"}'::jsonb, 18,
       'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=80', true
FROM "Product" WHERE "slug" = 'handwoven-market-tote'
ON CONFLICT ("sku") DO NOTHING;

INSERT INTO "ProductVariant" ("id", "productId", "sku", "options", "stock", "imageUrl", "isDefault")
SELECT 'demo-market-tote-variant-olive', "id", 'JB-ACC-TOT-001-OLV', '{"Color":"Olive"}'::jsonb, 12,
       'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80', false
FROM "Product" WHERE "slug" = 'handwoven-market-tote'
ON CONFLICT ("sku") DO NOTHING;

INSERT INTO "ProductCollection" ("productId", "collectionId")
SELECT product."id", collection."id"
FROM "Product" AS product
JOIN "Collection" AS collection ON collection."slug" = 'staff-picks'
WHERE product."slug" = 'handwoven-market-tote'
ON CONFLICT ("productId", "collectionId") DO NOTHING;