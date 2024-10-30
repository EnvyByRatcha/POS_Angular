/*
  Warnings:

  - Added the required column `qty` to the `SaleTempDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SaleTempDetail" ADD COLUMN     "qty" INTEGER NOT NULL;
