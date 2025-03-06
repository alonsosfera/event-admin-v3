import bcrypt from "bcrypt"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "../../../lib/prisma"

export const authOptions = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          const { phone, password } = credentials
          
          // Find the user directly from the database
          const user = await prisma.user.findUnique({ where: { phone } })
          
          if (!user) {
            throw new Error("invalid_credentials")
          }
          
          // Compare passwords
          const isValid = await bcrypt.compare(password, user.password)
          
          if (isValid) {
            // Return only the necessary user data (don't include password)
            const { id, name, phone, role } = user
            return { id, name, phone, role }
          } else {
            throw new Error("invalid_credentials")
          }
        } catch (e) {
          console.error("NextAuth authorize error:", e.message)
          throw new Error("server_error")
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
