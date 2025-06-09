-- Add CartReservation model
-- Note: This will be applied when running prisma migrate

-- CreateTable
CREATE TABLE "CartReservation" (
    "id" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "sessionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CartReservation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CartReservation_sessionId_idx" ON "CartReservation"("sessionId");

-- CreateIndex
CREATE INDEX "CartReservation_expiresAt_idx" ON "CartReservation"("expiresAt");

-- AddForeignKey
ALTER TABLE "CartReservation" ADD CONSTRAINT "CartReservation_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
