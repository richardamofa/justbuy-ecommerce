CREATE TABLE "NewsletterSubscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsletterSubscriber_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "NewsletterSubscriber_email_key" ON "NewsletterSubscriber"("email");
CREATE INDEX "NewsletterSubscriber_status_createdAt_idx" ON "NewsletterSubscriber"("status", "createdAt");

UPDATE "Category"
SET "imageUrl" = 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80'
WHERE "slug" = 'fashion' AND "imageUrl" IS NULL;

UPDATE "Category"
SET "imageUrl" = 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1200&q=80'
WHERE "slug" = 'electronics' AND "imageUrl" IS NULL;

UPDATE "Category"
SET "imageUrl" = 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1200&q=80'
WHERE "slug" = 'beauty' AND "imageUrl" IS NULL;

UPDATE "Category"
SET "imageUrl" = 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=80'
WHERE "slug" = 'home-living' AND "imageUrl" IS NULL;