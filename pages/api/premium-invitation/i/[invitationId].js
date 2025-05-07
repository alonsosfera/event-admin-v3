import { prisma } from '@/lib/prisma';
import short from "short-uuid";

export default async function handler(req, res) {
  const { invitationId } = req.query;
  
  const cleanedId = invitationId.substring(2);
  
  if (!cleanedId) {
    console.error("Missing invitationId");
    return res.status(400).json({ message: "Missing invitationId" });
  }

  try {
    const translator = short();
    const long = translator.toUUID(cleanedId)
    
    const invitation = await prisma.invitation.findUnique({
      where: { id: translator.toUUID(cleanedId) },
      include: {
        event: { 
          include: {
            premiumInvitation: {
              include: {
                sections: {
                  orderBy: { order: 'asc' }
                }
              }
            }
          }
        }
      },
    });

    if (!invitation) {
      console.error("No invitation found for this ID");
      return res.status(404).json({ message: "No invitation found for this ID" });
    }

    res.status(200).json(invitation);
  } catch (error) {
    console.error("Error fetching invitation:", error);
    res.status(500).json({ message: "Error fetching invitation", error });
  }
}
