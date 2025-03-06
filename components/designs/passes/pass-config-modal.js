import axios from "axios"
import dynamic from "next/dynamic"
import React, { useState, useEffect, useMemo } from "react"
import { Col, message, Modal, Row, Button, Tooltip, Slider, InputNumber, Form } from "antd"
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
  },[selectedFile])

  const [fontColor, setFontColor] = useState(generalCustomConfig.fontColor || "#000")
  const [fontSize, setFontSize] = useState(generalCustomConfig.fontSize || 30)
  const defaultItems = [
    { key: "Nombre del evento", coordinateX: 80, coordinateY: 15, customConfig: { fontColor, fontSize } },
    { key: "Nombre de invitado", coordinateX: 80, coordinateY: 60, customConfig: { fontColor, fontSize } },
    { key: "# de invitados", coordinateX: 80, coordinateY: 105, customConfig: { fontColor, fontSize } },
    { key: "Mesa", coordinateX: 80, coordinateY: 150, customConfig: { fontColor, fontSize } },
    { key: "Fecha", coordinateX: 80, coordinateY: 195, customConfig: { fontColor, fontSize } },
    { key: "Hora", coordinateX: 80, coordinateY: 240, customConfig: { fontColor, fontSize } },
    { key: "QR_CODE", coordinateX: 250, coordinateY: 150 }
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
            fontSize
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
          fontSize
        }
      }))
    )
  }, [fontColor, fontSize])

  const onSave = async () => {
    setLoading(true)
    try {
      const coordinates = items.map(coordinate => {
        const customConfig = coordinate.customConfig || {}
        return {
          ...coordinate,
          customConfig: JSON.stringify({ ...customConfig, fontSize, fontColor })
        }
      })
      await axios.put("/api/design/passes", {
        ...selectedFile,
        fileName,
        canvaMap: {
          ...selectedFile.canvaMap,
          coordinates
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
    const fontSizeValue = typeof value === "number" ? value.toString() : "30"
    setFontSize(fontSizeValue)
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
      visible={!!selectedFile}
      confirmLoading={loading}
      title={<EditableModalTitle title={fileName} onChange={setFileName} />}
      footer={[
        <Button
          key="delete" type="danger"
          onClick={onDelete}>
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
      ]}>
      <Row gutter={12}>
        <Col span={24}>
          <Form.Item
            label="Color de letra">
            <Tooltip
              color="white"
              trigger="click"
              title={
                <SketchPicker
                  color={fontColor}
                  onChangeComplete={color => setFontColor(color.hex)} />
              }>
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
