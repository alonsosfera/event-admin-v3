import { s3Client } from "../../../lib/s3Aws"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { v4 as uuidv4 } from "uuid"
import { CONFIG } from "../../../constants/config"
import ffmpeg from "fluent-ffmpeg"
import ffmpegStatic from "ffmpeg-static"
import { Readable, PassThrough } from "stream"

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "80mb"
    }
  }
};

async function recompressMp3(fileBuffer) {
  return new Promise((resolve, reject) => {
    const inputStream = new Readable();
    inputStream.push(Buffer.from(fileBuffer, "base64"));
    inputStream.push(null);

    const outputStream = new PassThrough();
    const outputChunks = [];

    outputStream.on('data', chunk => outputChunks.push(chunk));
    outputStream.on('end', () => {
      resolve(Buffer.concat(outputChunks));
    });
    outputStream.on('error', err => {
      console.error('Error capturando la salida recomprimida:', err);
      reject(new Error('Error recomprimiendo MP3'));
    });

    ffmpeg(inputStream)
      .setFfmpegPath(ffmpegStatic)
      .audioBitrate('64k')
      .format('mp3')
      .on('error', (err) => {
        console.error('Error en ffmpeg:', err);
        reject(new Error('Error procesando el audio'));
      })
      .pipe(outputStream, { end: true });
  });
}

async function uploadAudio(fileName, folder, compressedBuffer) {
  try {
    const [name] = fileName.split(".");
    const sanitized = name.replace(/\s+/g, "-");
    const fileKey = `EventAdminV2/${folder}/${sanitized}_${uuidv4()}.mp3`;

    const fileUrl = `https://${CONFIG.storage.DCM_AWS_BUCKET_NAME}.${CONFIG.storage.DCM_AWS_REGION}.digitaloceanspaces.com/${fileKey}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: CONFIG.storage.DCM_AWS_BUCKET_NAME,
        Key: fileKey,
        Body: compressedBuffer,
        ContentType: "audio/mpeg",
        ACL: "public-read"
      })
    );

    return { fileUrl };
  } catch (error) {
    console.error("Error uploading audio:", error);
    throw new Error("Error al subir archivo de audio");
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { fileName, folder, fileBuffer } = req.body;

    if (!fileName || !folder || !fileBuffer) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const compressedBuffer = await recompressMp3(fileBuffer);
    const { fileUrl } = await uploadAudio(fileName, folder, compressedBuffer);

    res.status(200).json({ fileUrl });
  } catch (error) {
    console.error("Error handling upload:", error);
    res.status(500).json({ error: "Upload failed", details: error.message });
  }
}
