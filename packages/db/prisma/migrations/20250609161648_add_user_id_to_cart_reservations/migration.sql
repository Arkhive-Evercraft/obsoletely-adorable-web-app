-- AlterTable
ALTER TABLE "CartReservation" ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE INDEX "CartReservation_userId_idx" ON "CartReservation"("userId");
