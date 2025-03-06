import { getSession } from "next-auth/react"

/**
 * @param context
 * @param userRole {String}
 */
export const pageAuth = async (context, userRole = null) => {
  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    }
  }

  const { role } = session.user
  if (userRole && !userRole === role) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false
      }
    }
  }

  return {
    props: { user: session.user }
  }
}
