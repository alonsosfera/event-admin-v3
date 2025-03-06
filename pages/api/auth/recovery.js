import axios from "axios"
import { prisma } from "../../../lib/prisma"

export default async function handler(req, res) {
  if (req.method === "POST"){
    try {
      const { phone } = req.body
      const user = await prisma.user.findUnique({ where: { phone } })

      const recovery = await prisma.passwordRecovery.upsert({
        where: { userId: user.id },
        update: { createdAt: new Date() },
        create: { user: { connect: { id: user.id } } }
      })

      const accessToken = `?access_token=${process.env.WHATSAPP_ACCESS_TOKEN}`
      await axios.post(`${process.env.WHATSAPP_URL}/messages${accessToken}`, {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: phone,
        type: "template",
        template: {
          name: "password_recovery_event_admin",
          language: {
            code: "es_MX"
          },
          components: [
            { type: "body", parameters: [{ type: "text", text: user.name }] },
            {
              index: "0",
              type: "button",
              sub_type: "url",
              parameters: [{ type: "text", text: recovery.id }]
            }
          ]
        }
      })
      res.json({ message: "Mensaje de recuperación enviado" })
    } catch (e) {
      res.status(500).json({ error: "Error al recuperar contraseña", message: e })
    }
  } else {
    res.status(405).json({ error: "Método no permitido" })
  }
}
