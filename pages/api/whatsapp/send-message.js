import fs from "fs"
import axios from "axios"
import short from "short-uuid"
import FormData from "form-data"
import multiparty from "multiparty"
import { prisma } from "../../../lib/prisma"

export const config = {
  api: {
    bodyParser: false
  }
}

export default async (req, res) => {
  try {
    const accessToken = `?access_token=${process.env.WHATSAPP_ACCESS_TOKEN}`
    const form = new multiparty.Form()

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error(err)
        res.status(500).json({ error: "File upload failed." })
        return
      }

      const { invitationId: [invitationId], phone: [phone], invitationName: [invitationName], premium: [premium] } = fields
      const { file: [file] } = files

      const fileName = `Invitacion_${invitationName.replaceAll(" ", "_")}.pdf`
      const data = new FormData()
      data.append("file", fs.createReadStream(file.path), fileName)
      data.append("type", "application/pdf")
      data.append("messaging_product", "whatsapp")
      const { data: { id } = {} } = await axios.post(`${process.env.WHATSAPP_URL}/media${accessToken}`, data, {
        headers: { ...data.getHeaders() }
      })
      const translator = short()

      await axios.post(`${process.env.WHATSAPP_URL}/messages${accessToken}`, {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: phone,
        type: "template",
        template: {
          name: "digital_pass",
          language: {
            code: "es_MX"
          },
          components: [
            {
              type: "header",
              parameters: [
                {
                  type: "document",
                  document: {
                    id,
                    filename: fileName
                  }
                }
              ]
            },
            {
              index: "0",
              type: "button",
              sub_type: "url",
              parameters: [
                {
                  type: "text",
                  text: premium === 'true' ? `p/i-${translator.fromUUID(invitationId)}` : `i-${translator.fromUUID(invitationId)}`
                }
              ]
            }
          ]
        }
      })

      await prisma.invitation.update({
        where: { id: invitationId },
        data: { deliveryStatus: true }
      })

      res.end()
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error, message: "Error al enviar invitación." })
  }
}