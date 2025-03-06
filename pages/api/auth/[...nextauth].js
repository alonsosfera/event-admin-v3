import axios from "axios"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        // If no error and we have user data, return it
        try {
          // Use absolute URL to avoid issues with relative paths in production
          const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URI
          const { data } = await axios.post(`${baseUrl}/api/auth/login`, credentials)
          return data.user
        } catch (e) {
          console.error("NextAuth authorize error:", e.message)
          if (e.response && e.response.status === 401) {
            throw new Error("invalid_credentials")
          } else {
            throw new Error("server_error")
          }
        }
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.role = user.role
        token.phone = user.phone
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.role = token.role
        session.user.phone = token.phone
      }
      return session
    }
  },
  pages: { signIn: "/", error: "/" },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development'
}


export default NextAuth(authOptions)
