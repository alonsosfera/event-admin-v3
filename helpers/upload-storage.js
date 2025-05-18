import axios from 'axios'
import imageCompression from 'browser-image-compression'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile } from '@ffmpeg/util'

let ffmpegInstance = null

async function getFFmpeg() {
  if (!ffmpegInstance) {
    ffmpegInstance = new FFmpeg()
    await ffmpegInstance.load()
  }
  return ffmpegInstance
}

async function compressImage(file) {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/webp',
    initialQuality: 0.6,
  }

  return await imageCompression(file, options)
}

async function compressAudio(file) {
  try {
    const ffmpeg = await getFFmpeg()
    
    await ffmpeg.writeFile('input.mp3', await fetchFile(file))
    
    await ffmpeg.exec([
      '-i', 'input.mp3',
      '-codec:a', 'libmp3lame',
      '-b:a', '64k',
      '-ac', '1',
      'output.mp3'
    ])
    
    const data = await ffmpeg.readFile('output.mp3')
    
    const compressedFile = new File(
      [data],
      file.name.replace(/\.[^/.]+$/, '.mp3'),
      { type: 'audio/mpeg' }
    )
    
    return compressedFile
  } catch (error) {
    console.error('Error comprimiendo audio:', error)
    throw error
  }
}

function fileToArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

function arrayBufferToBase64(buffer) {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  bytes.forEach((b) => (binary += String.fromCharCode(b)))
  return window.btoa(binary)
}

export async function uploadStorage(file, folder, endpoint = '/api/storage/premium-image-song', setUploadProgress, token) {
  try {
    if (file.type.startsWith('image/')) {
      file = await compressImage(file)
    } else if (file.type === 'audio/mpeg') {
      file = await compressAudio(file)
    }

    let originalName = file.name.replace(/\s+/g, '-')
    if (file.type === 'image/webp') {
      originalName = originalName.replace(/\.[^/.]+$/, '.webp')
    } else if (file.type === 'audio/mpeg') {
      originalName = originalName.replace(/\.[^/.]+$/, '.mp3')
    }

    const buffer = await fileToArrayBuffer(file)
    const fileBuffer = arrayBufferToBase64(buffer)


    if (file.size === 0) {
      throw new Error('El archivo está vacío. Posiblemente ocurrió un error al comprimir el audio.');
    }


    const response = await axios.post(
      endpoint,
      {
        fileName: originalName,
        folder,
        fileBuffer,
        mimeType: file.type,
      },
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        onUploadProgress: (e) => {
          if (e.total && setUploadProgress) {
            const percent = Math.round((e.loaded * 100) / e.total)
            setUploadProgress(percent)
          }
        },
      }
    )

    return response.data.fileUrl
  } catch (error) {
    console.error('Upload failed:', error)
    throw error
  }
}