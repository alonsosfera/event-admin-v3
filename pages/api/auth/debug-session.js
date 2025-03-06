import { getServerSession } from "next-auth/next"
import { authOptions } from "./[...nextauth]"

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions)
    
    // Return environment info and session data
    res.status(200).json({
      env: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        APP_URI: process.env.NEXT_PUBLIC_APP_URI,
        NODE_ENV: process.env.NODE_ENV
      },
      session: session,
      headers: req.headers
    })
  } catch (error) {
    console.error("Debug session error:", error)
    res.status(500).json({ error: error.message })
  }
} 