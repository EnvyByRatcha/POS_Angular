/*
  Warnings:

  - You are about to drop the column `size` on the `SaleTempDetail` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BillSaleDetail" ADD COLUMN     "size" TEXT;

-- AlterTable
ALTER TABLE "SaleTempDetail" DROP COLUMN "size",
ADD COLUMN     "foodSizeId" INTEGER;

-- AddForeignKey
ALTER TABLE "SaleTempDetail" ADD CONSTRAINT "SaleTempDetail_foodSizeId_fkey" FOREIGN KEY ("foodSizeId") REFERENCES "FoodSize"("id") ON DELETE SET NULL ON UPDATE CASCADE;
