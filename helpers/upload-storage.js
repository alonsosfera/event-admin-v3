import axios from 'axios'
import imageCompression from 'browser-image-compression'

let ffmpegInstance = null

async function getFFmpeg() {
  if (!ffmpegInstance) {
    const { createFFmpeg, fetchFile } = await import('@ffmpeg/ffmpeg')
    ffmpegInstance = createFFmpeg({ log: false })
    ffmpegInstance.fetchFile = fetchFile
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
  const ffmpeg = await getFFmpeg()

  const inputFile = 'input.mp3'
  const outputFile = 'output.mp3'

  ffmpeg.FS('writeFile', inputFile, await ffmpeg.fetchFile(file))
  await ffmpeg.run('-i', inputFile, '-b:a', '64k', outputFile)

  const data = ffmpeg.FS('readFile', outputFile)
  const blob = new Blob([data.buffer], { type: 'audio/mpeg' })

  return new File([blob], file.name, { type: 'audio/mpeg' })
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

export async function uploadStorage(file, folder, endpoint = '/api/storage/premium-image', setUploadProgress, token) {
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