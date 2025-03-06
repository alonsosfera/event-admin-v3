import {
  getEventById
} from "../../../../helpers/api/event"
import short from "short-uuid"

async function handler(req, res) {
  if (req.method === "GET") {
    const translator = short()
    req.query.id = translator.toUUID(req.query.id)
    await getEventById(req, res)
  } else {
    res.status(405).json({ error: "Método no permitido" })
  }
}

export default handler
