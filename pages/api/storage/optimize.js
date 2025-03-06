import { ImagePool } from "@squoosh/lib"
import { cpus } from "os"

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
    const imagePool = new ImagePool(cpus().length)
    try {
      const image = imagePool.ingestImage(Buffer.from(bufferString, "base64"))

      await image.encode({
        webp: {}
      })

      const optimizedImage = await image.encodedWith.webp
      res.status(200).json({
        binary: optimizedImage.binary.toString(),
        extension: optimizedImage.extension
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Failed to optimize image" })
    } finally {
      await imagePool.close()
    }
  } else {
    res.status(405).json({ error: "Method not allowed" })
  }
}
