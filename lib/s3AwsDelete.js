import { s3Client } from "./s3Aws";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { CONFIG } from "../constants/config";

/**
 * Deletes a file from S3 storage
 * @param {string} fileUrl - The full URL of the file to delete
 * @returns {Promise<boolean>} - True if deletion was successful
 */
export async function deleteFileFromS3(fileUrl) {
  try {
    // Extract the key from the file URL
    const baseUrl = `${CONFIG.storage.DCM_AWS_ENDPOINT}/object/public/${CONFIG.storage.DCM_AWS_BUCKET_NAME}/`;
    
    if (!fileUrl || !fileUrl.startsWith(baseUrl)) {
      throw new Error("Invalid file URL format");
    }
    
    const fileKey = fileUrl.substring(baseUrl.length);
    
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: CONFIG.storage.DCM_AWS_BUCKET_NAME,
        Key: fileKey
      })
    );
    
    return true;
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    throw new Error("Error al eliminar archivo");
  }
} 