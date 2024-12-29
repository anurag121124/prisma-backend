/*
  Warnings:

  - You are about to drop the column `mobileNumber` on the `users` table. All the data in the column will be lost.
  - Added the required column `mobile_number` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "mobileNumber",
ADD COLUMN     "mobile_number" TEXT NOT NULL;
