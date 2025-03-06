import { createInvitationDesign, getInvitationDesigns, updateInvitationDesign, deleteInvitationDesignById } from "../../../helpers/api/design"

async function handler(req, res) {
  if (req.method === "GET") {
    await getInvitationDesigns(req, res)
  } else if (req.method === "POST") {
    await createInvitationDesign(req, res)
  } else if (req.method === "PUT") {
    await updateInvitationDesign(req, res)
  }  else if (req.method === "DELETE") {
    await deleteInvitationDesignById (req , res)
  } else {
    res.status(405).json({ error: "Método no permitido" })
  }
}

export default handler
