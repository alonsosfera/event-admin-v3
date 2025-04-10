import { axios } from "../../helpers"
import ROLES from "../../enums/roles"
import { withAuthApi } from "../../helpers/auth/with-api-auth"


async function handler(req, res) {
  const API_KEY = process.env.GOOGLE_FONTS_API_KEY
  const { data: { items } } = await axios.get(`https://www.googleapis.com/webfonts/v1/webfonts?key=${API_KEY}&sort=popularity`)
  res.status(200).json({ fonts: items })
}

export default withAuthApi(handler, [ROLES.ADMIN, ROLES.HOST])
