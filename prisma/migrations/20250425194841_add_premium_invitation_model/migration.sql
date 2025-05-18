-- CreateTable
CREATE TABLE "PremiumInvitation" (
    "id" TEXT NOT NULL,
    "backgroundUrl" TEXT NOT NULL,
    "sectionBackgroundUrl" TEXT NOT NULL,
    "songUrl" TEXT NOT NULL,
    "eventId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PremiumInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PremiumInvitationSection" (
    "id" TEXT NOT NULL,
    "premiumInvitationId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PremiumInvitationSection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PremiumInvitation_eventId_key" ON "PremiumInvitation"("eventId");

-- AddForeignKey
ALTER TABLE "PremiumInvitation" ADD CONSTRAINT "PremiumInvitation_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PremiumInvitationSection" ADD CONSTRAINT "PremiumInvitationSection_premiumInvitationId_fkey" FOREIGN KEY ("premiumInvitationId") REFERENCES "PremiumInvitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
