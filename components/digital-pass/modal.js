import { Modal, Button, Row, Col, notification, Form, Tooltip, Slider, InputNumber } from "antd"
import { useEffect, useMemo, useState } from "react"
import { parseCookies } from "nookies"
import axios from "axios"
import { SketchPicker } from "react-color"
import dayjs from "dayjs"

import { DesignSelector } from "../designs/design-selector"
import { PassEditorLayout } from "./pass-editor-layout"
import { fileToArrayBuffer, arrayBufferToBase64 } from "../designs/helpers"

const defaultItems = (event, fontColor, fontSize) => [
  { key: "Nombre del evento", label: event.name, coordinateX: 80, coordinateY: 15, customConfig: { fontColor, fontSize } },
  { key: "Nombre de invitado", coordinateX: 80, coordinateY: 60, customConfig: { fontColor, fontSize } },
  { key: "# de invitados", coordinateX: 80, coordinateY: 105, customConfig: { fontColor, fontSize } },
  { key: "Mesa", coordinateX: 80, coordinateY: 150, customConfig: { fontColor, fontSize } },
  { key: "Fecha", label: dayjs(event.eventDate).format("DD/MM/YYYY"), coordinateX: 80, coordinateY: 195, customConfig: { fontColor, fontSize } },
  { key: "Hora", label: dayjs(event.eventDate).format("hh:mm a"), coordinateX: 80, coordinateY: 240, customConfig: { fontColor, fontSize } },
  { key: "QR_CODE", coordinateX: 250, coordinateY: 150, customConfig: { qrSize: 250 } }
]

export const DigitalPassModal = ({ isOpen, onCancel, onSubmit, event }) => {
  const { token } = parseCookies()

  const [isSaving, setIsSaving] = useState(false)
  const [updatedCoordinates, setUpdatedCoordinates] = useState([])
  const [previewFile, setPreviewFile] = useState(null)
  const [selectedPassId, setSelectedPassId] = useState(null)
  const [selectedPassUrl, setSelectedPassUrl] = useState(null)
  const [allPasses, setAllPasses] = useState([])
  const [activeSource, setActiveSource] = useState(null)
  const [scaleFactor, setScaleFactor] = useState(1)
  const [currentPage, setCurrentPage] = useState(0)
  const [hasInitialized, setHasInitialized] = useState(false)

  const generalCustomConfig = useMemo(() => {
    if (event?.digitalPass?.canvaMap?.coordinates?.length < 1) return {}
    const itemWithCustomConfig = event?.digitalPass?.canvaMap?.coordinates?.find(coordinate => {
      const currCustomConfig = JSON.parse(coordinate?.customConfig || "{}")
      return currCustomConfig.fontSize && currCustomConfig.fontColor
    })
    return JSON.parse(itemWithCustomConfig?.customConfig || "{}")
  }, [event])

  const [fontColor, setFontColor] = useState(generalCustomConfig.fontColor || "#000")
  const [fontSize, setFontSize] = useState(generalCustomConfig.fontSize || 30)

  const qrSizeFromConfig = useMemo(() => {
    if (!event?.digitalPass?.canvaMap?.coordinates?.length) return 250
    const qrItem = event.digitalPass.canvaMap.coordinates.find(item => item.key === "QR_CODE")
    return qrItem ? JSON.parse(qrItem.customConfig || "{}").qrSize || 250 : 250
  }, [event])

  const [qrSize, setQrSize] = useState(qrSizeFromConfig)

  const coordinates = event?.digitalPass?.canvaMap?.coordinates || []

  useEffect(() => {
    if (!hasInitialized && isOpen) {
      if (coordinates.length > 0) {
        setUpdatedCoordinates(coordinates.map(coord => {
          if (coord.key === "Nombre del evento") {
            return { ...coord, label: event.name }
          } else if (coord.key === "Fecha") {
            return { ...coord, label: dayjs(event.eventDate).format("DD/MM/YYYY") }
          } else if (coord.key === "Hora") {
            return { ...coord, label: dayjs(event.eventDate).format("hh:mm a") }
          }
          return coord
        }))
      } else {
        setUpdatedCoordinates(defaultItems(event, fontColor, fontSize))
      }
      setHasInitialized(true)
    }
  }, [coordinates, event, isOpen, hasInitialized, fontColor, fontSize])

  useEffect(() => {
    if (!isOpen) {
      setHasInitialized(false)
      setSelectedPassId(null)
      setSelectedPassUrl(null)
      setPreviewFile(null)
      setActiveSource(null)
    }
  }, [isOpen])

  useEffect(() => {
    const fetchAllPasses = async () => {
      try {
        const res = await axios.get("/api/design/passes", {
          headers: { Authorization: `Bearer ${token}` }
        })
        setAllPasses(res.data?.passes || [])
      } catch (err) {
        console.error("Error al obtener pases digitales:", err)
      }
    }

    fetchAllPasses()
  }, [])

  useEffect(() => {
    if (activeSource === "upload" && previewFile) {
      const defaultCoords = defaultItems(event, fontColor, fontSize)
      setUpdatedCoordinates(prev => {
        if (prev.length > 0) {
          return prev.map(item => {
            const defaultItem = defaultCoords.find(d => d.key === item.key)
            if (!defaultItem) return item

            if (item.key === "QR_CODE") {
              return {
                ...item,
                customConfig: JSON.stringify({
                  qrSize
                })
              }
            }
            return {
              ...item,
              customConfig: JSON.stringify({
                fontColor,
                fontSize
              })
            }
          })
        }
        return defaultCoords.map(item => ({
          ...item,
          customConfig: JSON.stringify(item.customConfig)
        }))
      })
    }
  }, [activeSource, previewFile])

  useEffect(() => {
    setUpdatedCoordinates(prev =>
      prev.map(item => {
        if (item.key === "QR_CODE") return item
        const currentConfig = typeof item.customConfig === 'string' 
          ? JSON.parse(item.customConfig) 
          : item.customConfig
        return {
          ...item,
          customConfig: JSON.stringify({
            ...currentConfig,
            fontColor
          })
        }
      })
    )
  }, [fontColor])

  useEffect(() => {
    setUpdatedCoordinates(prev =>
      prev.map(item => {
        if (item.key === "QR_CODE") return item
        const currentConfig = typeof item.customConfig === 'string' 
          ? JSON.parse(item.customConfig) 
          : item.customConfig
        return {
          ...item,
          customConfig: JSON.stringify({
            ...currentConfig,
            fontSize
          })
        }
      })
    )
  }, [fontSize])

  useEffect(() => {
    setUpdatedCoordinates(prev =>
      prev.map(item => {
        if (item.key !== "QR_CODE") return item
        const currentConfig = typeof item.customConfig === 'string' 
          ? JSON.parse(item.customConfig) 
          : item.customConfig
        return {
          ...item,
          customConfig: JSON.stringify({
            ...currentConfig,
            qrSize
          })
        }
      })
    )
  }, [qrSize])

  const handleSelectPass = (id) => {
    const selected = allPasses.find(pass => pass.id === id)
    if (!selected) return

    setSelectedPassId(id)
    setSelectedPassUrl(selected.fileUrl || null)
    setActiveSource("select")

    const coords = selected.canvaMap?.coordinates || []
    if (coords.length > 0) {
      setUpdatedCoordinates(coords.map(coord => {
        if (coord.key === "Nombre del evento") {
          return { ...coord, label: event.name }
        } else if (coord.key === "Fecha") {
          return { ...coord, label: dayjs(event.eventDate).format("DD/MM/YYYY") }
        } else if (coord.key === "Hora") {
          return { ...coord, label: dayjs(event.eventDate).format("hh:mm a") }
        }
        return coord
      }))
    } else {
      setUpdatedCoordinates(defaultItems(event, fontColor, fontSize))
    }
  }

  const handlePositionChange = (key, newX, newY) => {
    setUpdatedCoordinates(prev =>
      prev.map(c => (c.key === key ? { ...c, coordinateX: newX, coordinateY: newY } : c))
    )
  }

  const onFontSizeChange = value => {
    setFontSize(typeof value === "number" ? value : 30)
  }

  const handleSubmit = async () => {
    setIsSaving(true)
    try {
      let fileUrl = selectedPassUrl || event?.digitalPass?.fileUrl

      if (activeSource === "upload" && previewFile?.file) {
        const buffer = await fileToArrayBuffer(previewFile.file)
        const fileBuffer = arrayBufferToBase64(buffer)
        const fileType = previewFile.file.type.split("/")[1]

        const uploadRes = await axios.post("/api/storage/upload", {
          fileName: previewFile.file.name,
          fileType,
          folder: "passes",
          fileBuffer
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })

        fileUrl = uploadRes.data.fileUrl
      }

      const { room, room_name, ...eventToSave } = event

      await axios.put(`/api/events/update/${event.id}`, {
        ...eventToSave,
        digitalPass: {
          ...event?.digitalPass,
          fileUrl,
          canvaMap: { coordinates: updatedCoordinates }
        }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      onSubmit()

    } catch (err) {
      console.error("Error al guardar:", err)
      notification.error({
        message: "Error al guardar",
        description: "No se pudo guardar el pase digital.",
        placement: "topRight"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const modalTitle = useMemo(() => (
    <Row gutter={[24, 8]}>
      <Col xs={24}>Pase Digital</Col>

      <Col xs={24}>
        <DesignSelector
          previewFile={previewFile}
          setPreviewFile={setPreviewFile}
          activeSource={activeSource}
          setActiveSource={setActiveSource}
          selectedDesignId={selectedPassId}
          setSelectedDesignId={setSelectedPassId}
          setSelectedDesignUrl={setSelectedPassUrl}
          allDesigns={allPasses}
          handleSelectDesign={handleSelectPass}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          setUpdatedCoordinates={setUpdatedCoordinates}
          designType="pase"
        />
      </Col>

      <Col xs={24}>
        <Form.Item label="Color de letra">
          <Tooltip
            color="white"
            trigger="click"
            title={<SketchPicker color={fontColor} onChangeComplete={color => setFontColor(color.hex)} />}
          >
            <Button type="primary" style={{ marginBottom: "5px" }}>
              Seleccionar color de fuente
            </Button>
          </Tooltip>
        </Form.Item>
        <Form.Item label="Tamaño de letra">
          <Slider 
            min={12} 
            max={120} 
            onChange={onFontSizeChange} 
            value={parseInt(fontSize)} />
          <InputNumber 
            min={12} 
            max={120} 
            value={fontSize} 
            onChange={onFontSizeChange} />
        </Form.Item>
        <Form.Item label="Tamaño del QR">
          <Slider 
            min={100}
            max={800} 
            onChange={setQrSize} 
            value={qrSize} />
          <InputNumber 
            min={100} 
            max={800} 
            value={qrSize} 
            onChange={setQrSize} />
        </Form.Item>
      </Col>
    </Row>
  ), [previewFile, activeSource, selectedPassId, allPasses, currentPage, fontColor, fontSize, qrSize])

  return (
    <Modal
      centered
      width={800}
      title={modalTitle}
      open={isOpen}
      onCancel={onCancel}
      cancelText="Cancelar"
      okText="Guardar"
      confirmLoading={isSaving}
      onOk={handleSubmit}
    >
      <PassEditorLayout
        updatedCoordinates={updatedCoordinates}
        scaleFactor={scaleFactor}
        selectedFile={event?.digitalPass}
        selectedDesignUrl={selectedPassUrl}
        previewFile={previewFile}
        activeSource={activeSource}
        event={event}
        onScaleFactorChange={setScaleFactor}
        onPositionChange={handlePositionChange}
      />
    </Modal>
  )
} 