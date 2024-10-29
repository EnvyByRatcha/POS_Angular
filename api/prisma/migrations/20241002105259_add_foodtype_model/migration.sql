/*
  Warnings:

  - You are about to drop the column `reamark` on the `FoodType` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FoodType" DROP COLUMN "reamark",
ADD COLUMN     "remark" TEXT;
