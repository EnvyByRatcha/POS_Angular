/*
  Warnings:

  - You are about to drop the column `foodSizeId` on the `SaleTempDetail` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "SaleTempDetail" DROP CONSTRAINT "SaleTempDetail_foodSizeId_fkey";

-- AlterTable
ALTER TABLE "SaleTempDetail" DROP COLUMN "foodSizeId";
