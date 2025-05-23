import React, { useEffect, useState } from "react"
import { SketchPicker } from "react-color"
import { LeftCircleOutlined, LinkOutlined } from "@ant-design/icons"
import { Alert, Button, Form, Input, InputNumber, Slider, Tooltip } from "antd"
import dynamic from "next/dynamic"
const FontPicker = dynamic(() => import("../../shared/font-picker"), { ssr: false })

export const InvitationConfigItem = ({ scaleFactor, selectedFile, onSubmit }) => {
  const [form] = Form.useForm()
  const [fontColor, setFontColor] = useState(null)
  const [fontSize, setFontSize] = useState(12)
  const [fontFamily, setFontFamily] = useState("Merienda, cursive")

  useEffect(() => {
    setFontSize(12 / scaleFactor)
  }, [scaleFactor])

  const onAddItem = async () => {
    await form.validateFields()
    const values = await form.getFieldsValue()
    onSubmit({
      ...values,
      customConfig: { fontSize, fontColor, fontFamily }
    })
  }

  const onFontSizeChange = value => {
    setFontSize(parseInt(value / scaleFactor))
  }

  return (
    <Form
      form={form}
      name="basic"
      layout="vertical"
      initialValues={{ fileName: selectedFile.fileName }}>
      <Form.Item
        name="key"
        label="Valor del elemento"
        rules={[{ required: true }]}>
        <Input placeholder="Ej. Titulo, Padres, Iglesia, etc" />
      </Form.Item>
      <Form.Item
        label="Tamaño de letra">
        <Slider
          min={12}
          max={120}
          onChange={onFontSizeChange}
          value={typeof fontSize === "number" ? parseInt(fontSize * scaleFactor) : 12} />
        <InputNumber
          min={12}
          max={120}
          value={parseInt(fontSize * scaleFactor)}
          onChange={onFontSizeChange} />
      </Form.Item>
      <Form.Item
        label={
          <>
            Tipo de letra
            &nbsp;
            <a
              href="https://fonts.google.com/"
              target="_blank"
              rel="noreferrer"><LinkOutlined />
            </a>
          </>}>
        <FontPicker
          value={fontFamily}
          onChange={setFontFamily} />
      </Form.Item>
      <Form.Item
        label="Color de letra">
        <Tooltip
          color="white"
          trigger="click"
          title={<SketchPicker color={fontColor || "#000"} onChangeComplete={color => setFontColor(color.hex)} />}>
          <Button>Seleccionar color</Button>
        </Tooltip>
      </Form.Item>
      <Form.Item>
        <Alert
          type="info"
          message={
            <span style={{ fontSize: `${fontSize * scaleFactor}px`, color: fontColor, fontFamily }}>
              Ejemplo de texto
            </span>
          } />
      </Form.Item>
      <Form.Item>
        <Button style={{ width: "100%" }} onClick={onAddItem}><LeftCircleOutlined /> Agregar campo</Button>
      </Form.Item>
    </Form>
  )
}
