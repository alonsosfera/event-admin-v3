import { s3Client } from "../../../lib/s3Aws"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { v4 as uuidv4 } from "uuid"
import { CONFIG } from "../../../constants/config"

async function uploadFile(fileName, fileType, folder) {
  try {
    const [name] = fileName.split(".")
    const fileKey = `EventAdminV2/${folder}/${name}_${uuidv4()}.${fileType}`

    const signedUrl = await getSignedUrl(
      s3Client,
      new PutObjectCommand({
        Bucket: CONFIG.storage.DCM_AWS_BUCKET_NAME,
        Key: fileKey,
        ContentType: fileType
      }),
      {
        expiresIn: 3600
      }
    )
    const fileUrl =
      `https://${CONFIG.storage.DCM_AWS_BUCKET_NAME}.${CONFIG.storage.DCM_AWS_REGION}.digitaloceanspaces.com/${fileKey}`

    return { signedUrl, fileUrl }
  } catch (error) {
    console.error("Error uploading file:", error)
    throw new Error("Error al subir archivo")
  }
}

export default async function POST(request, res) {
  try {
    const { folder, fileName, fileType } = request.body

    const { signedUrl, fileUrl } = await uploadFile(fileName, fileType, folder)

    res.status(200).json({ signedUrl, fileUrl })
  } catch (error) {
    console.error("Error uploading file:", error)
    res.status(500).json({ error: "Error al subir archivo" })
  }
}
