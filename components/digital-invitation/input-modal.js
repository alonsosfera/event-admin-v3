import React, { useState, useEffect } from "react"
import { Input, Tooltip, Button, Slider, InputNumber, Row, Col, Divider } from "antd"
import { LinkOutlined, CheckOutlined, ArrowsAltOutlined } from "@ant-design/icons"
import { SketchPicker } from "react-color"

const InvitationField = ({ label, value, onChange, onLinkChange, linkValue }) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false)
  const [link, setLink] = useState(linkValue || "")
  const [buttonSize, setButtonSize] = useState(12)
  const [isButton, setIsButton] = useState(false)
  const [buttonBg, setButtonBg] = useState("#1890ff")

  useEffect(() => {
    try {
      let customConfig;
      if (typeof linkValue === "string" && linkValue.trim().startsWith("{")) {
        customConfig = JSON.parse(linkValue);
      } else {
        customConfig = { link: linkValue };
      }
      setIsButton(customConfig.isButton || false);
      if (customConfig.isButton) {
        setButtonSize(customConfig.fontSize || 12);
        setButtonBg(customConfig.buttonStyle?.backgroundColor || "#1890ff");
      } else {
        setLink(linkValue || "");
      }
    } catch (e) {
      console.error("Error al parsear la configuración:", e);
      setIsButton(false);
    }
  }, [linkValue])

  const handleLinkChange = () => {
    if (link !== value) {
      onLinkChange(link)
    }
    setIsTooltipVisible(false)
  }

  const handleButtonSizeChange = (newSize) => {
    setButtonSize(newSize)
    try {
      const customConfig = JSON.parse(linkValue || "{}")
      const newConfig = {
        ...customConfig,
        fontSize: newSize,
        isButton: true
      }
      
      onLinkChange(JSON.stringify(newConfig))
    } catch (e) {
      console.error("Error al actualizar el tamaño del botón:", e)
    }
  }

  const handleButtonBgChange = (color) => {
    setButtonBg(color.hex || color)
    try {
      const customConfig = JSON.parse(linkValue || "{}")
      const newConfig = {
        ...customConfig,
        isButton: true,
        buttonStyle: {
          ...(customConfig.buttonStyle || {}),
          backgroundColor: color.hex || color
        }
      }
      onLinkChange(JSON.stringify(newConfig))
    } catch (e) {
      console.error("Error al actualizar el color de fondo del botón:", e)
    }
  }

  if (isButton) {
  return (
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
              title={<SketchPicker color={buttonBg} onChangeComplete={handleButtonBgChange} />}
            >
              <Button>Seleccionar color</Button>
            </Tooltip>
          </Col>
        </Row>
      </div>
    </>
  );
}


  return (
    <div style={{ marginBottom: "1rem", position: "relative" }}>
      <Input
        placeholder={label}
        style={{ marginRight: "2rem" }}
        value={value}
        onChange={onChange} />
      <Tooltip
        color="white"
        title={
          <div style={{ display: "flex" }}>
            <Input
              placeholder="Enlace"
              value={link}
              onChange={e => setLink(e.target.value)}
              style={{ marginRight: "0.5rem" }} />
            <Button
              icon={<CheckOutlined />}
              onClick={handleLinkChange} />
          </div>
        }
        open={isTooltipVisible}
        onOpenChange={setIsTooltipVisible}
        trigger="click"
        placement="topRight">
        <Button
          icon={<LinkOutlined />}
          style={{ position: "absolute", right: 0, top: 0, backgroundColor: "#ffffff" }}
          onClick={() => setIsTooltipVisible(!isTooltipVisible)} />
      </Tooltip>
    </div>
  )
}

export default InvitationField
