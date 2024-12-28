/*
  Warnings:

  - Made the column `fullName` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `mobile_number` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `socketId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "fullName" SET NOT NULL,
ALTER COLUMN "mobile_number" SET NOT NULL,
ALTER COLUMN "password" SET NOT NULL,
ALTER COLUMN "socketId" SET NOT NULL;
