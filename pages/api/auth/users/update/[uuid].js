import { updateUser } from "../../../../../helpers/api/auth/users"
import ROLES from "../../../../../enums/roles"
import { withAuthApi } from "../../../../../helpers/auth/with-api-auth"

async function handler(req, res) {
  if (req.method === "PUT") {
    await updateUser(req, res)
  } else {
    res.status(405).json({ error: "Método no permitido" })
  }
}

export default withAuthApi(handler, [ROLES.ADMIN])
