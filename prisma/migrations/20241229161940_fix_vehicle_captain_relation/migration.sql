/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RideStatus" AS ENUM ('PENDING', 'ACCEPTED', 'ONGOING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CaptainStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('CAR', 'MOTORCYCLE', 'AUTO');

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "socketId" TEXT,
    "password" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "firebaseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rides" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "captainId" TEXT,
    "pickup" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "fare" DOUBLE PRECISION NOT NULL,
    "status" "RideStatus" NOT NULL DEFAULT 'PENDING',
    "duration" INTEGER,
    "distance" DOUBLE PRECISION,
    "paymentId" TEXT,
    "orderId" TEXT,
    "signature" TEXT,
    "otp" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "captains" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "socketId" TEXT,
    "status" "CaptainStatus" NOT NULL DEFAULT 'INACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "captains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "plate" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "vehicleType" "VehicleType" NOT NULL,
    "captainId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "captainId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blacklist_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blacklist_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_firebaseId_key" ON "users"("firebaseId");

-- CreateIndex
CREATE INDEX "rides_userId_idx" ON "rides"("userId");

-- CreateIndex
CREATE INDEX "rides_captainId_idx" ON "rides"("captainId");

-- CreateIndex
CREATE UNIQUE INDEX "captains_email_key" ON "captains"("email");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_plate_key" ON "vehicles"("plate");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_captainId_key" ON "vehicles"("captainId");

-- CreateIndex
CREATE UNIQUE INDEX "locations_captainId_key" ON "locations"("captainId");

-- CreateIndex
CREATE UNIQUE INDEX "blacklist_tokens_token_key" ON "blacklist_tokens"("token");

-- CreateIndex
CREATE INDEX "blacklist_token_token_idx" ON "blacklist_tokens"("token");

-- CreateIndex
CREATE INDEX "blacklist_token_createdAt_idx" ON "blacklist_tokens"("createdAt");

-- AddForeignKey
ALTER TABLE "rides" ADD CONSTRAINT "rides_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rides" ADD CONSTRAINT "rides_captainId_fkey" FOREIGN KEY ("captainId") REFERENCES "captains"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_captainId_fkey" FOREIGN KEY ("captainId") REFERENCES "captains"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_captainId_fkey" FOREIGN KEY ("captainId") REFERENCES "captains"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
