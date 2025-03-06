import { PlusOutlined } from "@ant-design/icons"
import { Button, Modal, Upload, message } from "antd"
import React, { useState } from "react"
import axios from "axios"

const getBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })

export const UploadImage = () => {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState("")
  const [previewTitle, setPreviewTitle] = useState("")
  const [fileUpload, setFileList] = useState([])
  const [loading, setLoading] = useState(false)

  const handleCancel = () => setPreviewOpen(false)

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    setPreviewImage(file.url || file.preview)
    setPreviewOpen(true)
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf("/") + 1))
  }

  const onUpload = ({ file, onError, onSuccess, onProgress }) => {

    setLoading(true)
    axios.post("/api/storage/upload", {
      fileName: file.name,
      fileType: file.type
    }).then(({ data }) => {
      const options = {
        onUploadProgress: event => {
          const { loaded, total } = event
          onProgress({ percentage: Math.round((loaded / total) * 100) }, file)
        },
        headers: { "Content-Type": file.type }
      }
      axios.put(data.signedUrl, file, options)
        .then(result => {
          setLoading(false)
          onSuccess(result, file)
          message.success("Archivo cargado correctamente")
        }).catch(error => onError(error))
    }).catch(error => console.error(error))
  }


  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Upload
        type="file"
        listType="picture-card"
        customRequest={onUpload}
        multiple={false}
        fileList={fileUpload}
        disabled={loading}
        onPreview={handlePreview}>
        <div>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>Cargar</div>
        </div>
      </Upload>
      <Modal
        visible={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}>
        <img
          alt="example"
          style={{ width: "100%" }}
          src={previewImage} />
      </Modal>
    </div>
  )
}