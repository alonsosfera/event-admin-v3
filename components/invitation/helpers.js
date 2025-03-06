import axios from "axios"
import { parseCookies } from "nookies"

const { token } = parseCookies()

export const getInvitation = (setState, id) => {
  axios.get(`/api/invitations/${id}`,{ headers:{ "Authorization": `Bearer ${token}` } })
    .then(res => {
      const { data = {} } = res
      setState(data)
    })
}
