import React, { useState, useEffect } from "react"
import { Input, Tooltip, Button, Slider, InputNumber, Row, Col } from "antd"
import { LinkOutlined, CheckOutlined, ArrowsAltOutlined } from "@ant-design/icons"

const InvitationField = ({ label, value, onChange, onLinkChange, linkValue }) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false)
  const [link, setLink] = useState(linkValue || "")
  const [buttonSize, setButtonSize] = useState(12)
  const [isButton, setIsButton] = useState(false)

  useEffect(() => {
    try {
      const customConfig = JSON.parse(linkValue || "{}")
      setIsButton(customConfig.isButton || false)
      if (customConfig.isButton) {
        setButtonSize(customConfig.fontSize || 12)
      } else {
        setLink(linkValue || "")
      }
    } catch (e) {
      console.error("Error al parsear la configuración:", e)
      setIsButton(false)
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
        isButton: true,
        buttonStyle: {
          ...customConfig.buttonStyle,
          padding: `${newSize * 0.3}px ${newSize * 0.6}px`,
          borderRadius: `${newSize * 0.3}px`
        }
      }
      onLinkChange(JSON.stringify(newConfig))
    } catch (e) {
      console.error("Error al actualizar el tamaño del botón:", e)
    }
  }

  if (isButton) {
    return (
      <div style={{ marginBottom: "1rem", position: "relative" }}>
        <Row gutter={[8, 8]} align="middle">
          <Col span={16}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <ArrowsAltOutlined style={{ marginRight: "8px" }} />
              <span>Tamaño del botón</span>
            </div>
          </Col>
          <Col span={8}>
            <InputNumber
              min={8}
              max={48}
              value={buttonSize}
              onChange={handleButtonSizeChange}
              style={{ width: "100%" }}
            />
          </Col>
          <Col span={24}>
            <Slider
              min={8}
              max={48}
              value={buttonSize}
              onChange={handleButtonSizeChange}
            />
          </Col>
        </Row>
      </div>
    )
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
