import { checkInGuest } from "../../../../helpers/api/invitation"
import { withAuthApi } from "../../../../helpers/auth/with-api-auth"

async function handler(req, res) {
  if (req.method === "PUT") {
    await checkInGuest(req, res)
  } else {
    res.status(405).json({ error: "Método no permitido" })
  }
}

export default withAuthApi(handler)
