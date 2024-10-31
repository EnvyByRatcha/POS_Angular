/*
  Warnings:

  - You are about to drop the column `invoice` on the `BillSaleDetail` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BillSale" ADD COLUMN     "invoice" TEXT;

-- AlterTable
ALTER TABLE "BillSaleDetail" DROP COLUMN "invoice";
