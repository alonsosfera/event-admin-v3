import { message } from "antd"
import axios from "../axios"

export async function Recover(phone) {
  const sending = message.loading("Enviando...", 0)
  try {
    await axios.post("/api/auth/recovery", { phone })
    message.success("Mensaje de recuperación enviado.")
  } catch (e) {
    message.error("Hubo un error...")
    console.error("Error recovering password", e)
  } finally {
    sending()
  }
}
