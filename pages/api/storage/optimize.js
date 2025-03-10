import sharp from 'sharp'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "80mb"
    }
  }
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { bufferString } = req.body
    
    try {
      
      const imageBuffer = Buffer.from(bufferString, "base64")
      
      const optimizedImage = await sharp(imageBuffer)
        .webp({ quality: 80 })
        .toBuffer()

      const optimizedString = optimizedImage.toString('base64')

      res.status(200).json({
        binary: optimizedString,
        extension: 'webp'
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Failed to optimize image" })
    }
  } else {
    res.status(405).json({ error: "Method not allowed" })
  }
}
