import { useState, useEffect } from "react"
import { Card, Row, Typography, Col, Avatar, Upload, Button } from 'antd'
import { PhoneOutlined, UserOutlined, UploadOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const PremiumInvitationContact = ({ isEditing, onDataChange, sectionData, globalTitleColor, globalSubtitleColor, globalTypography }) => {
  const [subtitle, setSubtitle] = useState("")
  const [contacts, setContacts] = useState([])

  useEffect(() => {
    setSubtitle(
      sectionData?.subtitle ||
      "Si tienes alguna duda, no dudes en contactarnos"
    )
    setContacts(
      sectionData?.contacts || [
        { name: "Carla", phone: "555-901-3030", avatar: "/assets/Mujer.jpg" },
        { name: "Luis", phone: "555-901-3030", avatar: "/assets/Hombre.jpg" }
      ]
    )
  }, [sectionData])

  const updateContacts = (updated) => {
    setContacts(updated)
    onDataChange?.({ subtitle, contacts: updated })
  }

  const updateContact = (index, key, value) => {
    const updated = [...contacts]
    updated[index][key] = value
    updateContacts(updated)
  }

  const handleImageChange = (index) => (file) => {
    const newUrl = URL.createObjectURL(file)
    const updated = [...contacts]
    updated[index].avatar = newUrl
    updated[index].avatarFile = file
    updateContacts(updated)
    return false
  }

  const handleDelete = (index) => {
    const updated = [...contacts]
    updated.splice(index, 1)
    updateContacts(updated)
  }

  const handleAddContact = () => {
    const updated = [
      ...contacts,
      { name: "Nuevo contacto", phone: "000-000-0000", avatar: "" }
    ]
    updateContacts(updated)
  }

  const handleSubtitleChange = (val) => {
    setSubtitle(val)
    onDataChange?.({ subtitle: val, contacts })
  }

  return (
    <>
      <Title level={1} style={{ color: globalTitleColor, marginBottom: '30px', fontWeight: 'bold', fontFamily: globalTypography }}>
        Contacto
      </Title>

      <Text
        editable={isEditing ? {
          triggerType: ['icon', 'text'],
          onChange: handleSubtitleChange
        } : false}
        style={{
          fontSize: '18px',
          color: globalSubtitleColor,
          display: 'block',
          marginBottom: '40px',
          fontFamily: globalTypography
        }}
      >
        {subtitle}
      </Text>

      <Row gutter={[24, 24]} justify="center">
        {contacts.map((contact, index) => (
          <Col xs={24} sm={12} key={index} style={{ position: 'relative' }}>
            {isEditing && (
              <CloseOutlined
                onClick={() => handleDelete(index)}
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 60,
                  fontSize: 18,
                  color: '#ff4d4f',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  zIndex: 1,
                  boxShadow: '0 0 3px rgba(0,0,0,0.2)'
                }}
              />
            )}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                size={200}
                src={contact.avatar}
                icon={<UserOutlined />}
                style={{
                  backgroundColor: '#f2f2f2',
                  marginBottom: '20px',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)'
                }}
              />

              {isEditing && (
                <Upload
                  accept="image/*"
                  showUploadList={false}
                  beforeUpload={handleImageChange(index)}
                >
                  <Button
                    icon={<UploadOutlined />}
                    size="small"
                    type="primary"
                    style={{ marginBottom: '20px' }}
                  >
                    Cambiar imagen
                  </Button>
                </Upload>
              )}

              <Title
                level={2}
                style={{
                  color: globalTitleColor,
                  fontWeight: 'bold',
                  marginBottom: '10px',
                  fontFamily: globalTypography
                }}
                editable={isEditing ? {
                  triggerType: ['icon', 'text'],
                  onChange: (val) => updateContact(index, "name", val)
                } : false}
              >
                {contact.name}
              </Title>

              <div style={{
                marginRight: "20px",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <PhoneOutlined style={{
                  marginRight: '10px',
                  fontSize: '18px',
                  color: '#8e44ad'
                }} />
                <Text
                  style={{ fontSize: '18px', color: globalSubtitleColor, fontFamily: globalTypography }}
                  editable={isEditing ? {
                    triggerType: ['icon', 'text'],
                    onChange: (val) => updateContact(index, "phone", val)
                  } : false}
                >
                  {contact.phone}
                </Text>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {isEditing && (
        <div style={{ marginTop: '40px' }}>
          <Button icon={<PlusOutlined />} type="dashed" onClick={handleAddContact}>
            Agregar contacto
          </Button>
        </div>
      )}
    </>
  )
}

export default PremiumInvitationContact
