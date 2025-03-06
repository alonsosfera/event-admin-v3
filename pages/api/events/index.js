import {
  getAllEvents,
  postNewEvent,
  getEventById,
  deleteEventById
} from "../../../helpers/api/event"
import ROLES from "../../../enums/roles"
import { withAuthApi } from "../../../helpers/auth/with-api-auth"

async function handler(req, res) {
  if (req.method === "GET") {
    if (req.query.id){
      await getEventById(req, res)
    } else {
      await getAllEvents(req, res)
    }
  } else if (req.method === "POST") {
    await postNewEvent(req, res)
  } else if (req.method === "DELETE") {
    await deleteEventById(req, res)
  } else {
    res.status(405).json({ error: "Método no permitido" })
  }
}

export default withAuthApi(handler, [ROLES.ADMIN])
