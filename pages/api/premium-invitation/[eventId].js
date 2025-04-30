import { prisma } from '@/lib/prisma'

export default async function handler(req, res) {
  const { eventId } = req.query

  if (!eventId) {
    return res.status(400).json({ message: "Missing eventId" })
  }

  try {
    const premiumInvitation = await prisma.premiumInvitation.findUnique({
      where: { eventId },
      include: {
        sections: {
         orderBy: { order: 'asc' }
        }
      }
    })

    if (!premiumInvitation) {
      return res.status(404).json({ message: "No premium invitation found for this event" })
    }

    res.status(200).json(premiumInvitation)
  } catch (error) {
    console.error("Error fetching premium invitation", error)
    res.status(500).json({ message: "Error fetching premium invitation", error })
  }
}
