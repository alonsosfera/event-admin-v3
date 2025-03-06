import {
  postNewInvitation,
  getEventInvitations,
  deleteInvitationById,
  putEditInvitationById
} from "../../../helpers/api/invitation"
import { withAuthApi } from "../../../helpers/auth/with-api-auth"

async function handler(req, res) {
  if (req.method === "GET") {
    await getEventInvitations(req, res)
  } else if (req.method === "POST") {
    await postNewInvitation(req, res)
  } else if (req.method === "PUT") {
    await putEditInvitationById(req, res)
  } else if (req.method === "DELETE") {
    await deleteInvitationById(req, res)
  } else {
    res.status(405).json({ error: "Método no permitido" })
  }
}

export default withAuthApi(handler)
