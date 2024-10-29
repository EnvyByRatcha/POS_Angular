/*
  Warnings:

  - You are about to drop the column `reamrk` on the `FoodType` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FoodType" DROP COLUMN "reamrk",
ADD COLUMN     "reamark" TEXT;
