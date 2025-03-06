import { prisma } from "../../../lib/prisma"
import bcrypt from "bcrypt"
import axios from "axios"

const SALT_ROUNDS = 10
export const createUser = async (req, res) => {
  try {
    const { name, phone, role } = req.body

    const randomPassword = Math.random().toString(36).slice(-10)
    const hash = bcrypt.hashSync(randomPassword, SALT_ROUNDS)

    const user = await prisma.user.create({
      data: {
        name,
        role,
        phone,
        password: hash
      }
    })

    const accessToken = `?access_token=${process.env.WHATSAPP_ACCESS_TOKEN}`
    await axios.post(`${process.env.WHATSAPP_URL}/messages${accessToken}`, {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: phone,
      type: "template",
      template: {
        name: "event_admin_signup",
        language: {
          code: "es_MX"
        },
        components: [
          { type: "body", parameters: [{ type: "text", text: name }] },
          {
            index: "0",
            type: "button",
            sub_type: "url",
            parameters: [{ type: "text", text: `?phone=${phone}&pass=${randomPassword}` }]
          }
        ]
      }
    })

    res.json({ user, message: "Usuario creado exitosamente" })
  } catch (error) {
    if (error.code === "P2002") {
      // Check for the unique constraint violation code
      res.status(400).json({ message: "El usuario ya existe" })
      console.error("Unique constraint violation. A record with this value already exists.")
    } else {
      console.error(error)
      res.status(500).json({ message: "Error al crear usuario", error })
    }
  }
}

export const updateUser = async (req, res) => {
  try {
    const { uuid } = req.req
    const { userProperties } = req.body
    await prisma.user.update({ where: { id: uuid }, data: userProperties })
    res.json({ message : "User successfully updated!" })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error,
      message: "Ocurrió un error al actualizar el usuario"
    })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const { uuid } = req.query
    await prisma.user.delete({ where: { id: uuid } })
    res.json({ message : "User successfully deleted!" })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error,
      message: "Ocurrió un error al borrar el usuario"
    })
  }
}
