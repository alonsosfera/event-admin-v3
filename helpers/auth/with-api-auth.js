import { getServerSession } from "next-auth"
import { authOptions } from "../../pages/api/auth/[...nextauth]"

/**
 * @param handler
 * @param allowedRoles {?Array.<String>}
 */
export const withAuthApi = (handler, allowedRoles = null) => {
  return async (req, res) => {
    try {
      // Get the session from the request
      const session = await getServerSession(req, res, authOptions)

      if (!session) {
        return res.status(401).json({ error: "Unauthorized request" })
      }

      if (allowedRoles && !allowedRoles.includes(session.user.role)) {
        return res.status(403).json({ error: "Unauthorized request" })
      }

      // Token is valid, continue processing the request
      return handler(req, res)
    } catch (error) {
      // Token verification failed or token is invalid
      console.error("Token verification failed:", error)
      return res.status(401).json({ error: "Invalid token" })
    }
  }
}
