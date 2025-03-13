import bcrypt from "bcrypt"
import dayjs from "dayjs"
import { prisma } from "../../../lib/prisma"

export default async function handler(req, res) {
  if (req.method === "POST"){
    try {
      const { password, recovery } = req.body
      const userRecovery = await prisma.passwordRecovery.findUnique({
        where: { id: recovery },
        include: { user: true }
      })

      if (!userRecovery) {
        return res.status(404).json({ message: "No se encontró la solicitud de recuperación" })
      } else if (dayjs(userRecovery.createdAt).add(1, "day").isBefore(dayjs())) {
        await prisma.passwordRecovery.delete({ where: { id: recovery } })
        return res.status(400).json({ expired: true, message: "La solicitud de recuperación ha expirado, favor de solicitar una nueva." })
      }

      await prisma.user.update({
        where: { id: userRecovery.user.id },
        data: { password: bcrypt.hashSync(password, 10) }
      })

      await prisma.passwordRecovery.delete({ where: { id: recovery } })

      res.json({ message: "Contraseña actualizada!" })
    } catch (e) {
      res.status(500).json({ error: "Error al iniciar sesión", message: e })
    }
  } else {
    res.status(405).json({ error: "Método no permitido" })
  }
}
