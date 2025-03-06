import { getEventByInvitationById } from "../../../../helpers/api/invitation"

async function handler(req, res) {
  if (req.method === "GET") {
    await getEventByInvitationById(req, res)
  } else {
    res.status(405).json({ error: "Método no permitido" })
  }
}

export default handler
