/*
  Warnings:

  - Added the required column `expiry` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "expiry" TIMESTAMP(3) NOT NULL;
