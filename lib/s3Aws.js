import { S3Client } from "@aws-sdk/client-s3"
import { CONFIG } from "../constants/config"

 export const s3Client = new S3Client({
  region: CONFIG.storage.DCM_AWS_REGION,
  endpoint: CONFIG.storage.DCM_AWS_ENDPOINT,
  credentials: {
    accessKeyId: CONFIG.storage.DCM_AWS_ACCESS_KEY,
    secretAccessKey: CONFIG.storage.DCM_AWS_SECRET_KEY
  }
})
