import ROLES from "../../../../enums/roles"
import { prisma } from "../../../../lib/prisma"
import { withAuthApi } from "../../../../helpers/auth/with-api-auth"

async function handler(req, res) {
  if (req.method === "GET") {
    const users = await prisma.user.findMany()
    res.json(users)
  } else {
    res.status(405).json({ error: "Método no permitido" })
  }
}

export default withAuthApi(handler, [ROLES.ADMIN])
