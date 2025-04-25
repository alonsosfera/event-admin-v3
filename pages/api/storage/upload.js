import { s3Client } from "../../../lib/s3Aws"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { v4 as uuidv4 } from "uuid"
import { CONFIG } from "../../../constants/config"
import sharp from "sharp";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "80mb"
    }
  }
}

async function uploadFile(fileName, folder, fileBuffer) {
  try {
    const [name] = fileName.split(".")
    const fileKey = `${folder}/${name}_${uuidv4()}.webp`

    const signedUrl = await getSignedUrl(
      s3Client,
      new PutObjectCommand({
        Bucket: CONFIG.storage.DCM_AWS_BUCKET_NAME,
        Key: fileKey,
        ContentType: "webp"
      }),
      {
        expiresIn: 3600
      }
    )
    const fileUrl =
      `${CONFIG.storage.DCM_AWS_ENDPOINT}/object/public/${CONFIG.storage.DCM_AWS_BUCKET_NAME}/${fileKey}`

    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.DCM_AWS_BUCKET_NAME,
        Key: fileKey,
        Body: fileBuffer,
        ContentType: "webp",
        ACL: "public-read"
      })
    )

    return { signedUrl, fileUrl }
  } catch (error) {
    console.error("Error uploading file:", error)
    throw new Error("Error al subir archivo")
  }
}

export default async function POST(request, res) {
  try {
    const { fileName, folder, fileBuffer } = request.body

    const compressedBuffer = await sharp(Buffer.from(fileBuffer, "base64"))
      .webp({ quality: 60 })
      .toBuffer()

    const { signedUrl, fileUrl } = await uploadFile(fileName, folder, compressedBuffer)

    res.status(200).json({ signedUrl, fileUrl })
  } catch (error) {
    console.error("Error uploading file:", error)
    res.status(500).json({ error: "Error al subir archivo" })
  }
}
