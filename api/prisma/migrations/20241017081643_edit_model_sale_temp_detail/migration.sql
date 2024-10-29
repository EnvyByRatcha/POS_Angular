/*
  Warnings:

  - You are about to drop the column `tastId` on the `SaleTempDetail` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SaleTempDetail" DROP COLUMN "tastId",
ADD COLUMN     "tasteId" INTEGER;
