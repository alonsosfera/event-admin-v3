import React, { useEffect, useState } from "react"
import { SketchPicker } from "react-color"
import { LeftCircleOutlined, LinkOutlined, ArrowsAltOutlined } from "@ant-design/icons"
import { Alert, Button, Form, Input, InputNumber, Slider, Tooltip, Row, Col, Divider } from "antd"
import dynamic from "next/dynamic"
const FontPicker = dynamic(() => import("../../shared/font-picker"), { ssr: false })

export const InvitationConfigItem = ({ scaleFactor, selectedFile, onSubmit, customConfig, onCustomConfigChange }) => {
  const [form] = Form.useForm()
  const [fontColor, setFontColor] = useState(null)
  const [fontSize, setFontSize] = useState(12)
  const [fontFamily, setFontFamily] = useState("Merienda, cursive")

  const isButton = customConfig?.isButton
  const [buttonSize, setButtonSize] = useState(customConfig?.fontSize || 12)
  const [buttonBg, setButtonBg] = useState(customConfig?.buttonStyle?.backgroundColor || "#1890ff") 

  useEffect(() => {
    if (isButton) {
      setButtonSize(customConfig?.fontSize || 12);
      setButtonBg(customConfig?.buttonStyle?.backgroundColor || "#1890ff");
    }
  }, [customConfig, isButton]);

  console.log(isButton, customConfig);
  

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

  const handleButtonSizeChange = (newSize) => {
  setButtonSize(newSize)
  const updatedConfig = {
    ...customConfig,
    fontSize: newSize,
    isButton: true,
    buttonStyle: {
      ...(customConfig?.buttonStyle || {}),
      backgroundColor: buttonBg
    }
  }
  onCustomConfigChange?.(updatedConfig)
}

const handleButtonBgChange = (color) => {
  setButtonBg(color.hex)
  const updatedConfig = {
    ...customConfig,
    isButton: true,
    fontSize: buttonSize,
    buttonStyle: {
      ...(customConfig?.buttonStyle || {}),
      backgroundColor: color.hex
    }
  }
  onCustomConfigChange?.(updatedConfig)
}


  return (
    <>
      <div
        style={{
          position: "relative",
          border: "2px solid #dcdcdc",
          borderRadius: "8px",
          padding: "16px",
        }}>
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
      </div>  
      {isButton && (
        <>
          <Divider>Configuración del botón</Divider>
          <div
            style={{
              position: "relative",
              border: "2px solid #dcdcdc",
              borderRadius: "8px",
              padding: "16px",
            }}
          >
            <Row gutter={[8, 8]} align="middle">
              <Col span={16}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <ArrowsAltOutlined style={{ marginRight: "8px" }} />
                  <span>Tamaño del botón</span>
                </div>
              </Col>
              <Col span={8}>
                <InputNumber
                  min={12}
                  max={120}
                  value={buttonSize}
                  onChange={handleButtonSizeChange}
                  style={{ width: "100%" }}
                />
              </Col>
              <Col span={24}>
                <Slider
                  min={12}
                  max={120}
                  value={buttonSize}
                  onChange={handleButtonSizeChange}
                />
              </Col>
              <Col span={24} style={{ marginTop: 16, textAlign: "center" }}>
                <Tooltip
                  color="white"
                  trigger="click"
                  title={
                    <SketchPicker
                      color={buttonBg}
                      onChangeComplete={handleButtonBgChange}
                    />
                  }
                >
                  <Button>Seleccionar color</Button>
                </Tooltip>
              </Col>
            </Row>
          </div>
        </>
      )}
    </>
  )
  
}
