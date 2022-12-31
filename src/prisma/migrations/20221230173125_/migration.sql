/*
  Warnings:

  - You are about to drop the column `password` on the `Login` table. All the data in the column will be lost.
  - Added the required column `hashedPassword` to the `Login` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Login" DROP COLUMN "password",
ADD COLUMN     "hashedPassword" TEXT NOT NULL;
