export default function handler(req, res) {
  const { error } = req.query
  
  console.error("NextAuth error:", error)
  
  res.status(200).json({ 
    error: error,
    message: "An authentication error occurred. Please try again."
  })
} 