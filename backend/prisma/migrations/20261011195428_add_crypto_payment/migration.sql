/*
  Warnings:

  - A unique constraint covering the columns `[txHash]` on the table `Ticket` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `txHash` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `walletAddress` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "price" SET DATA TYPE DECIMAL(18,8);

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "txHash" TEXT NOT NULL,
ADD COLUMN     "walletAddress" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_txHash_key" ON "Ticket"("txHash");
