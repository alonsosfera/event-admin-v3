import { s3Client } from "@/lib/s3Aws"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { v4 as uuidv4 } from "uuid"
import { CONFIG } from "@/constants/config"

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "80mb"
    }
  }
}

async function uploadFile(fileName, folder, fileBuffer, mimeType) {
  try {
    const [name] = fileName.split(".")
    const extension = mimeType === 'image/webp'
      ? 'webp'
      : mimeType === 'audio/mpeg'
      ? 'mp3'
      : 'bin'

    const fileKey = `EventAdminV2/${folder}/${name}_${uuidv4()}.${extension}`

    const fileUrl = `https://${CONFIG.storage.DCM_AWS_BUCKET_NAME}.${CONFIG.storage.DCM_AWS_REGION}.digitaloceanspaces.com/${fileKey}`

    await s3Client.send(
      new PutObjectCommand({
        Bucket: CONFIG.storage.DCM_AWS_BUCKET_NAME,
        Key: fileKey,
        Body: fileBuffer,
        ContentType: mimeType,
        ACL: "public-read"
      })
    )

    return { fileUrl }
  } catch (error) {
    console.error("Error uploading file:", error)
    throw new Error("Error al subir archivo")
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" })
  }

  try {
    const { fileName, folder, fileBuffer, mimeType } = req.body

    if (!fileName || !folder || !fileBuffer || !mimeType) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    const buffer = Buffer.from(fileBuffer, "base64")
    const { fileUrl } = await uploadFile(fileName, folder, buffer, mimeType)

    res.status(200).json({ fileUrl })
  } catch (error) {
    console.error("Error handling upload:", error)
    res.status(500).json({ error: "Upload failed", details: error.message })
  }
}
