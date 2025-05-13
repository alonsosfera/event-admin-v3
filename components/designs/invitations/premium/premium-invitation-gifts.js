import { useState, useEffect } from "react"
import { Col, Row, Typography, Button, Input } from 'antd'
import { GiftOutlined, BankOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons'

const { Text, Title } = Typography

const defaultButtons = [
  {
    label: "Mesa de Regalos",
    link: "https://mesaderegalos.liverpool.com.mx/",
    icon: <GiftOutlined style={{ fontSize: '28px', color: '#8e44ad' }} />
  },
  {
    label: "Sobre de Efectivo",
    link: "",
    icon: <BankOutlined style={{ fontSize: '28px', color: '#8e44ad' }} />
  }
]

const PremiumInvitationGift = ({ isEditing, onDataChange, sectionData, globalTitleColor, globalSubtitleColor }) => {
  const [title, setTitle] = useState("Regalos")
  const [subtitle, setSubtitle] = useState(
    "Tu presencia es nuestro mayor regalo, pero si deseas contribuir con algo especial, aquí tienes algunas opciones"
  )
  const [buttons, setButtons] = useState(defaultButtons)

  useEffect(() => {
    setTitle(sectionData?.title || "Regalos")
    setSubtitle(
      sectionData?.subtitle ||
      "Tu presencia es nuestro mayor regalo, pero si deseas contribuir con algo especial, aquí tienes algunas opciones"
    )
    setButtons(
      sectionData?.buttons?.map((b) => ({
        ...b,
        icon: <GiftOutlined style={{ fontSize: '28px', color: '#8e44ad' }} />
      })) || defaultButtons
    )
  }, [sectionData])

  const updateButtons = (updated) => {
    setButtons(updated)
    onDataChange?.({
      title,
      subtitle,
      buttons: updated.map(({ label, link }) => ({ label, link }))
    })
  }

  const handleButtonLabelChange = (index, newLabel) => {
    const updated = [...buttons]
    updated[index].label = newLabel
    updateButtons(updated)
  }

  const handleButtonLinkChange = (index, newLink) => {
    const updated = [...buttons]
    updated[index].link = newLink
    updateButtons(updated)
  }

  const handleAddButton = () => {
    const updated = [
      ...buttons,
      {
        label: "Nuevo Botón",
        link: "",
        icon: <GiftOutlined style={{ fontSize: '28px', color: '#8e44ad' }} />
      }
    ]
    updateButtons(updated)
  }

  const handleRemoveButton = (index) => {
    const updated = [...buttons]
    updated.splice(index, 1)
    updateButtons(updated)
  }

  const handleTitleChange = (val) => {
    setTitle(val)
    onDataChange?.({
      title: val,
      subtitle,
      buttons: buttons.map(({ label, link }) => ({ label, link }))
    })
  }

  const handleSubtitleChange = (val) => {
    setSubtitle(val)
    onDataChange?.({
      title,
      subtitle: val,
      buttons: buttons.map(({ label, link }) => ({ label, link }))
    })
  }

  return (
    <>
      <Title
        level={1}
        style={{ color: globalTitleColor, marginBottom: '10px', fontWeight: 'bold' }}
        editable={isEditing ? {
          triggerType: ['icon', 'text'],
          onChange: handleTitleChange
        } : false}
      >
        {title}
      </Title>

      <Text
        editable={isEditing ? {
          triggerType: ['icon', 'text'],
          onChange: handleSubtitleChange
        } : false}
        style={{
          display: "block",
          fontSize: '16px',
          color: globalSubtitleColor,
          fontWeight: "bold",
          marginTop: "40px"
        }}
      >
        {subtitle}
      </Text>

      <Row gutter={[16, 16]} justify="center" style={{ marginTop: "50px" }}>
        {buttons.map((button, index) => (
          <Col xs={24} sm={12} key={index} style={{ position: 'relative' }}>
            {isEditing && (
              <CloseOutlined
                onClick={() => handleRemoveButton(index)}
                style={{
                  position: 'absolute',
                  top: -10,
                  right: -10,
                  fontSize: 18,
                  color: '#ff4d4f',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  zIndex: 1,
                  boxShadow: '0 0 3px rgba(0,0,0,0.2)'
                }}
              />
            )}
            <Button
              type="default"
              size="large"
              icon={button.icon}
              onClick={() => {
                if (button.link && button.link.trim() !== "#" && button.link.trim() !== "") {
                  window.open(button.link, "_blank")
                }
              }}
              style={{
                padding: '30px 40px',
                fontSize: '20px',
                fontWeight: 'bold',
                height: 'auto',
                minHeight: '64px',
                gap: '16px',
                width: '100%',
              }}
            >
              {button.label}
            </Button>

            {isEditing && (
              <div style={{ marginTop: 10 }}>
                <Input
                  placeholder="Texto del botón"
                  value={button.label}
                  onChange={(e) => handleButtonLabelChange(index, e.target.value)}
                  style={{ marginBottom: 5 }}
                />
                <Input
                  placeholder="Link del botón"
                  value={button.link}
                  onChange={(e) => handleButtonLinkChange(index, e.target.value)}
                  style={{ marginBottom: 5 }}
                />
              </div>
            )}
          </Col>
        ))}
      </Row>

      {isEditing && (
        <Button
          icon={<PlusOutlined />}
          type="dashed"
          onClick={handleAddButton}
          style={{ marginTop: '20px', width: '100%', maxWidth: 200 }}
        >
          Agregar otro botón
        </Button>
      )}
    </>
  )
}

export default PremiumInvitationGift
