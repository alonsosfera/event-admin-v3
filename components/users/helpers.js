import { parseCookies } from "nookies"
import axios from "axios"

const { token } = parseCookies()

export const deletUserByUuid = async uuid => {
    if (!uuid) throw new Error("UUID requerido")
    await axios.delete(`/api/auth/users/delete/${uuid}`, { headers: { "Authorization": `Bearer ${token}`}})
}