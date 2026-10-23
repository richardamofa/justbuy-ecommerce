UPDATE "Order"
SET "paymentStatus" = 'paid',
    "paidAt" = COALESCE("paidAt", "updatedAt")
WHERE "status" IN ('paid', 'processing', 'shipped', 'delivered')
  AND "paymentStatus" = 'pending';