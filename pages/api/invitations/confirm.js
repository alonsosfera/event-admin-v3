import { prisma } from "../../../lib/prisma"
import short from "short-uuid"

const translator = short()

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { invitationId, confirmed } = req.body

    const cleanedId = invitationId.substring(2)

    try {
      const id = translator.toUUID(cleanedId)

      const confirmation = await prisma.invitation.update({
        where: {
          id: id
        },
        data: {
          confirmed
        }
      })

      res.status(201).json(confirmation)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Error updating confirmation" })
    }
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}
