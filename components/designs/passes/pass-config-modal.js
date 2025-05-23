import axios from "axios"
import dynamic from "next/dynamic"
import React, { useState, useEffect, useMemo } from "react"
import { Col, message, Modal, Row, Button, Tooltip, Slider, InputNumber, Form, Radio, Flex } from "antd"
import { EditableModalTitle } from "../../shared"
import { SketchPicker } from "react-color"

const PassConfigMap = dynamic(() => import("./pass-config-map"), {
  ssr: false
})

export const PassConfigModal = ({ onClose, onSuccess, selectedFile }) => {
  if (!selectedFile) return null

  const [scaleFactor, setScaleFactor] = useState(1)
  const [fileName, setFileName] = useState(selectedFile.fileName)
  const [loading, setLoading] = useState(false)

  const generalCustomConfig = useMemo(() => {
    if (selectedFile?.canvaMap?.coordinates?.length < 1) return {}
    const itemWithCustomConfig = selectedFile?.canvaMap?.coordinates?.find(coordinate => {
      const currCustomConfig = JSON.parse(coordinate?.customConfig || "{}")
      return currCustomConfig.fontSize && currCustomConfig.fontColor
    })
    return JSON.parse(itemWithCustomConfig?.customConfig || "{}")
  }, [selectedFile])

  const [fontColor, setFontColor] = useState(generalCustomConfig.fontColor || "#000")
  const [fontSize, setFontSize] = useState(generalCustomConfig.fontSize || 30)
  const [textAlign, setTextAlign] = useState(generalCustomConfig.textAlign || "center")

  const qrSizeFromConfig = useMemo(() => {
    if (!selectedFile?.canvaMap?.coordinates?.length) return 250
    const qrItem = selectedFile.canvaMap.coordinates.find(item => item.key === "QR_CODE")
    return qrItem ? JSON.parse(qrItem.customConfig || "{}").qrSize || 250 : 250
  }, [selectedFile])

  const [qrSize, setQrSize] = useState(qrSizeFromConfig)

  const defaultItems = [
    { key: "Nombre del evento", coordinateX: 80, coordinateY: 15, customConfig: { fontColor, fontSize, textAlign } },
    { key: "Nombre de invitado", coordinateX: 80, coordinateY: 60, customConfig: { fontColor, fontSize, textAlign } },
    { key: "# de invitados", coordinateX: 80, coordinateY: 105, customConfig: { fontColor, fontSize, textAlign } },
    { key: "Mesa", coordinateX: 80, coordinateY: 150, customConfig: { fontColor, fontSize, textAlign } },
    { key: "Fecha", coordinateX: 80, coordinateY: 195, customConfig: { fontColor, fontSize, textAlign } },
    { key: "Hora", coordinateX: 80, coordinateY: 240, customConfig: { fontColor, fontSize, textAlign } },
    { key: "QR_CODE", coordinateX: 250, coordinateY: 150, customConfig: { qrSize } }
  ]

  const [items, setItems] = useState(() => {
    if (selectedFile?.canvaMap?.coordinates?.length) {
      return selectedFile.canvaMap.coordinates.map(coordinate => {
        const currCustomConfig = JSON.parse(coordinate.customConfig || "{}")
        return {
          ...coordinate,
          customConfig: {
            ...currCustomConfig,
            fontColor,
            fontSize,
            textAlign,
            qrSize: coordinate.key === "QR_CODE" ? currCustomConfig.qrSize || 250 : undefined
          }
        }
      })
    }
    return defaultItems
  })

  useEffect(() => {
    setItems(prevItems =>
      prevItems.map(item => ({
        ...item,
        customConfig: {
          ...item.customConfig,
          fontColor,
          fontSize,
          textAlign,
          qrSize: item.key === "QR_CODE" ? qrSize : item.customConfig.qrSize
        }
      }))
    )
  }, [fontColor, fontSize, textAlign, qrSize])

  const onSave = async () => {
    setLoading(true)
    try {
      const updatedItems = items.map(coordinate => ({
        ...coordinate,
        customConfig: JSON.stringify({
          ...coordinate.customConfig,
          qrSize: coordinate.key === "QR_CODE" ? qrSize : coordinate.customConfig.qrSize,
          fontColor,
          textAlign
        })
      }))

      await axios.put("/api/design/passes", {
        ...selectedFile,
        fileName,
        canvaMap: {
          ...selectedFile.canvaMap,
          coordinates: updatedItems
        }
      })

      onSuccess()
      message.success("Diseño guardado correctamente")
      onClose()
    } catch (error) {
      message.error("Error al guardar")
      console.error("Error saving design:", error)
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async () => {
    setLoading(true)
    try {
      await axios.delete(`/api/design/passes?id=${selectedFile.id}`)
      onSuccess()
      message.success("Diseño eliminado correctamente")
      onClose()
    } catch (error) {
      message.error("Error al eliminar el diseño")
      console.error("Error deleting design:", error)
    } finally {
      setLoading(false)
    }
  }

  const onFontSizeChange = value => {
    setFontSize(typeof value === "number" ? value.toString() : "30")
  }

  const onUpdateItemPosition = (item, coordinates) => {
    setItems(prevState =>
      prevState.map(i => (i.key === item.key ? { ...i, ...coordinates } : i))
    )
  }

  return (
    <Modal
      width={800}
      onOk={onSave}
      okText="Guardar"
      onCancel={onClose}
      open={!!selectedFile}
      confirmLoading={loading}
      title={<EditableModalTitle title={fileName} onChange={setFileName} />}
      footer={[
        <Button key="delete" type="primary" 
          danger onClick={onDelete}>
          Eliminar
        </Button>,
        <Button key="back" onClick={onClose}>
          Cancelar
        </Button>,
        <Button 
          key="submit" type="primary" 
          loading={loading} onClick={onSave}>
          Guardar
        </Button>
      ]}
    >
      <Row gutter={12}>
        <Col span={24}>
          <Form
            labelAlign="left"
            labelCol={{ span: 4 }}
            wrapperCol={{ span:20 }}>
            <Flex gap="middle" align="stretch">
              <div style={{ flex: 1 }}>
                <Form.Item 
                  label="Alineación"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
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
                  wrapperCol={{ span: 16 }}
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
              style={{ marginBottom: 20 }}
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
          <PassConfigMap 
            items={items} 
            scaleFactor={scaleFactor} 
            selectedFile={selectedFile} 
            setScaleFactor={setScaleFactor} 
            onUpdateItemPosition={onUpdateItemPosition} />
        </Col>
      </Row>
    </Modal>
  )
}
