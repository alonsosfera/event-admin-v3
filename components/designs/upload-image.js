import axios from "axios"
import React, { useState } from "react"
import { Button, Upload, message } from "antd"
import { UploadOutlined } from "@ant-design/icons"

import { arrayBufferToBase64, fileToArrayBuffer } from "./helpers"

export const UploadImage = ({ folder, onSubmit }) => {
  const [loading, setLoading] = useState(false)

  const beforeUpload = file => {
    const isLt2M = file.size / 1024 / 1024 < 10
    if (!isLt2M) {
      message.error("El tamaño de la imagen debe ser menor a 10MB ")
    }
    return isLt2M
  }

  const onUpload = async ({ file, onError, onSuccess }) => {
    setLoading(true)
    try {
      const arrayBuffer = await fileToArrayBuffer(file)
      const base64String = arrayBufferToBase64(arrayBuffer)
      const { data: optimizedData } = await axios.post("/api/storage/optimize", { bufferString: base64String })

      const binaryArray = Buffer.from(optimizedData.binary, 'base64')
      const blob = new Blob([binaryArray], { type: `image/${optimizedData.extension}` })
      const { data } = await axios.post("/api/storage/upload", {
        fileName: file.name,
        fileType: optimizedData.extension,
        folder
      })

      const options = {
        headers: {
          "Content-Type": optimizedData.extension,
          "x-amz-acl": "public-read"
        }
      }
      await axios.put(data.signedUrl, blob, options)
      onSuccess(null, file)
      const { data: { savedFile } } = await axios.post(`/api/design/${folder}`, {
        fileName: file.name,
        fileUrl: data.fileUrl
      })
      onSubmit(savedFile)
      message.success("Archivo cargado correctamente")
    } catch (error) {
      onError(error)
      message.error("Error al subir el archivo")
      console.error("Error uploading file:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Upload
        accept="image/*"
        showUploadList={false}
        customRequest={onUpload}
        beforeUpload={beforeUpload}>
        <Button
          type="primary"
          loading={loading}
          icon={<UploadOutlined />}>
          Cargar nuevo
        </Button>
      </Upload>
    </div>
  )
}
