/*
  Warnings:

  - Added the required column `foodSizeId` to the `SaleTempDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SaleTempDetail" ADD COLUMN     "foodSizeId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "SaleTempDetail" ADD CONSTRAINT "SaleTempDetail_foodSizeId_fkey" FOREIGN KEY ("foodSizeId") REFERENCES "FoodSize"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleTempDetail" ADD CONSTRAINT "SaleTempDetail_tasteId_fkey" FOREIGN KEY ("tasteId") REFERENCES "Taste"("id") ON DELETE SET NULL ON UPDATE CASCADE;
