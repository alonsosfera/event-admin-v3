import { Modal, Button, Row, Col, notification, Form, Tooltip, Slider, InputNumber, Radio, Flex, Typography } from "antd"
import { useEffect, useMemo, useState } from "react"
import { parseCookies } from "nookies"
import axios from "axios"
import { SketchPicker } from "react-color"
import dayjs from "../shared/time-zone"
import { DesignSelector } from "../designs/design-selector"
import { PassEditorLayout } from "./pass-editor-layout"
import { fileToArrayBuffer, arrayBufferToBase64 } from "../designs/helpers"

const defaultItems = (event, fontColor, fontSize, textAlign = "center") => [
  { key: "Nombre del evento", label: event.name, coordinateX: 80, coordinateY: 15, customConfig: { fontColor, fontSize, textAlign } },
  { key: "Nombre de invitado", coordinateX: 80, coordinateY: 60, customConfig: { fontColor, fontSize, textAlign } },
  { key: "# de invitados", coordinateX: 80, coordinateY: 105, customConfig: { fontColor, fontSize, textAlign } },
  { key: "Mesa", coordinateX: 80, coordinateY: 150, customConfig: { fontColor, fontSize, textAlign } },
  { key: "Fecha", label: dayjs.utc(event.eventDate).tz('America/Mexico_City').format("DD [de] MMMM"), coordinateX: 80, coordinateY: 195, customConfig: { fontColor, fontSize, textAlign } },
  { key: "Hora", label: dayjs.utc(event.eventDate).tz('America/Mexico_City').format("hh:mm A"), coordinateX: 80, coordinateY: 240, customConfig: { fontColor, fontSize, textAlign } },
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
  const [textAlign, setTextAlign] = useState(generalCustomConfig.textAlign || "center")

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
            return { ...coord, label: dayjs.utc(event.eventDate).tz('America/Mexico_City').format("DD [de] MMMM") }
          } else if (coord.key === "Hora") {
            return { ...coord, label: dayjs.utc(event.eventDate).tz('America/Mexico_City').format("hh:mm a") }
          }
          return coord
        }))
      } else {
        setUpdatedCoordinates(defaultItems(event, fontColor, fontSize, textAlign))
      }
      setHasInitialized(true)
    }
  }, [coordinates, event, isOpen, hasInitialized, fontColor, fontSize, textAlign])

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
      const defaultCoords = defaultItems(event, fontColor, fontSize, textAlign)
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
                fontSize,
                textAlign
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
        if (item.key === "QR_CODE") return item
        const currentConfig = typeof item.customConfig === 'string' 
          ? JSON.parse(item.customConfig) 
          : item.customConfig
        return {
          ...item,
          customConfig: JSON.stringify({
            ...currentConfig,
            textAlign
          })
        }
      })
    )
  }, [textAlign])

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
          return { ...coord, label: dayjs.utc(event.eventDate).tz('America/Mexico_City').format("DD [de] MMMM") }
        } else if (coord.key === "Hora") {
          return { ...coord, label: dayjs.utc(event.eventDate).tz('America/Mexico_City').format("hh:mm A") }
        }
        return coord
      }))
    } else {
      setUpdatedCoordinates(defaultItems(event, fontColor, fontSize, textAlign))
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

      await axios.put(`/api/events/digital-pass/${event.id}`, {
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

  return (
    <Modal
      centered
      width={800}
      title={"Pase Digital"}
      open={isOpen}
      onCancel={onCancel}
      cancelText="Cancelar"
      okText="Guardar"
      confirmLoading={isSaving}
      onOk={handleSubmit}
    >
      <Row gutter={[24, 8]}>
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
          <Form labelAlign="left" style={{ border: "1px solid lightgray", padding: 20, borderRadius: 10, marginBottom: 10 }}>
            <Flex>
              <div style={{ flex: 1 }}>
                <Form.Item 
                  label="Alineación"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  style={{ marginBottom: 20 }}
                >
                  <Radio.Group value={textAlign} onChange={e => setTextAlign(e.target.value)}>
                    <Radio.Button value="left">Izquierda</Radio.Button>
                    <Radio.Button value="center">Centro</Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </div>
              <div style={{ flex: 1 }}>
                <Form.Item 
                  label="Color de letra"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 18 }}
                  style={{ marginBottom: 20 }}
                >
                  <Tooltip
                    color="white"
                    trigger="click"
                    title={<SketchPicker color={fontColor} onChangeComplete={color => setFontColor(color.hex)} />}
                  >
                    <Button type="primary">
                      Seleccionar color
                    </Button>
                  </Tooltip>
                </Form.Item>
              </div>
            </Flex>
            <Form.Item 
              label="Tamaño de letra"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              style={{ marginBottom: 20 }}
            >
              <Row gutter={8}>
                <Col flex="auto">
                  <Slider 
                    min={12} 
                    max={120} 
                    onChange={onFontSizeChange} 
                    value={parseInt(fontSize)}
                  />
                </Col>
                <Col flex="80px">
                  <InputNumber 
                    min={12} 
                    max={120} 
                    value={fontSize} 
                    onChange={onFontSizeChange}
                    style={{ width: '100%' }}
                  />
                </Col>
              </Row>
            </Form.Item>
            <Form.Item 
              label="Tamaño del QR"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              style={{ marginBottom: 0 }}
            >
              <Row gutter={8}>
                <Col flex="auto">
                  <Slider 
                    min={100}
                    max={800} 
                    onChange={setQrSize} 
                    value={qrSize}
                  />
                </Col>
                <Col flex="80px">
                  <InputNumber 
                    min={100} 
                    max={800} 
                    value={qrSize} 
                    onChange={setQrSize}
                    style={{ width: '100%' }}
                  />
                </Col>
              </Row>
            </Form.Item>
          </Form>
        </Col>
        <Col>
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
        </Col>
      </Row>
    </Modal>
  )
} 