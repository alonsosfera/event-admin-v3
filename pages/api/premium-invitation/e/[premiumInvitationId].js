import { prisma } from '@/lib/prisma';
import short from "short-uuid"

export default async function handler(req, res) {
  const { premiumInvitationId } = req.query;

  if (!premiumInvitationId) {
    console.error("Missing premiumInvitationId");
    return res.status(400).json({ message: "Missing premiumInvitationId" });
  }

  try {
    const translator = short()
    const premiumInvitation = await prisma.premiumInvitation.findUnique({
      where: { id: translator.toUUID(premiumInvitationId) },
      include: {
        sections: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!premiumInvitation) {
      console.error("No premium invitation found for this ID");
      return res.status(404).json({ message: "No premium invitation found for this ID" });
    }

    res.status(200).json(premiumInvitation);
  } catch (error) {
    console.error("Error fetching premium invitation:", error);
    res.status(500).json({ message: "Error fetching premium invitation", error });
  }
}
