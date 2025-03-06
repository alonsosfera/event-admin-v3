import axios from "axios"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        // If no error and we have user data, return it
        try {
          const { data } = await axios.post(`${process.env.NEXT_PUBLIC_APP_URI}/api/auth/login`, credentials)
          return data.user
        } catch (e) {
          if (e.response.status === 401) {
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
  secret: process.env.NEXTAUTH_SECRET
}


export default NextAuth(authOptions)
