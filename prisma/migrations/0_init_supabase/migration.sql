-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'HOST');

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assistance" INTEGER NOT NULL,
    "hostId" TEXT NOT NULL,
    "mainTable" BOOLEAN DEFAULT false,
    "tablesDistribution" JSONB,
    "roomId" TEXT NOT NULL,
    "type" TEXT,
    "design" TEXT,
    "arrivedGuests" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invitation" (
    "id" TEXT NOT NULL,
    "numberGuests" INTEGER NOT NULL DEFAULT 1,
    "arrivedGuests" INTEGER NOT NULL DEFAULT 0,
    "invitationName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT NOT NULL DEFAULT '',
    "eventId" TEXT NOT NULL,
    "invitationTables" JSONB[] DEFAULT ARRAY[]::JSONB[],
    "deliveryStatus" BOOLEAN DEFAULT false,
    "confirmed" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoomMap" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "creationDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "eventId" TEXT,

    CONSTRAINT "RoomMap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DigitalPass" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "uploadTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventId" TEXT,

    CONSTRAINT "DigitalPass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DigitalInvitation" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "uploadTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventId" TEXT,

    CONSTRAINT "DigitalInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CanvaMap" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "creationDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "roomMapId" TEXT,
    "digitalPassId" TEXT,
    "digitalInvitationId" TEXT,

    CONSTRAINT "CanvaMap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coordinates" (
    "id" TEXT NOT NULL,
    "key" TEXT,
    "label" TEXT,
    "customConfig" TEXT,
    "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "coordinateX" INTEGER,
    "coordinateY" INTEGER,
    "canvaMapId" TEXT,

    CONSTRAINT "Coordinates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "phoneVerified" TIMESTAMP(3),
    "role" "UserRole" NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordRecovery" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PasswordRecovery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RoomMap_eventId_key" ON "RoomMap"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "DigitalPass_eventId_key" ON "DigitalPass"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "DigitalInvitation_eventId_key" ON "DigitalInvitation"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "CanvaMap_roomMapId_key" ON "CanvaMap"("roomMapId");

-- CreateIndex
CREATE UNIQUE INDEX "CanvaMap_digitalPassId_key" ON "CanvaMap"("digitalPassId");

-- CreateIndex
CREATE UNIQUE INDEX "CanvaMap_digitalInvitationId_key" ON "CanvaMap"("digitalInvitationId");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordRecovery_userId_key" ON "PasswordRecovery"("userId");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomMap" ADD CONSTRAINT "RoomMap_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DigitalPass" ADD CONSTRAINT "DigitalPass_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DigitalInvitation" ADD CONSTRAINT "DigitalInvitation_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanvaMap" ADD CONSTRAINT "CanvaMap_roomMapId_fkey" FOREIGN KEY ("roomMapId") REFERENCES "RoomMap"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanvaMap" ADD CONSTRAINT "CanvaMap_digitalPassId_fkey" FOREIGN KEY ("digitalPassId") REFERENCES "DigitalPass"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanvaMap" ADD CONSTRAINT "CanvaMap_digitalInvitationId_fkey" FOREIGN KEY ("digitalInvitationId") REFERENCES "DigitalInvitation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coordinates" ADD CONSTRAINT "Coordinates_canvaMapId_fkey" FOREIGN KEY ("canvaMapId") REFERENCES "CanvaMap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordRecovery" ADD CONSTRAINT "PasswordRecovery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

