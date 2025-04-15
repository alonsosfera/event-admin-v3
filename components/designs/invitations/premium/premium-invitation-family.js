import { useState } from "react"
import { Card, Typography, Row, Col, Avatar, Upload, Button } from "antd"
import { UploadOutlined, CloseOutlined, PlusOutlined } from "@ant-design/icons"

const { Title, Text } = Typography

const PremiumInvitationFamily = ({ isEditing, onDataChange }) => {
  const [title, setTitle] = useState("Nuestra Familia y Amigos")

  const [familyMembers, setFamilyMembers] = useState([
    { name: "María & Carlos", role: "Padres de la Novia", avatar: "/assets/esposos.jpeg" },
    { name: "Ana & Juan", role: "Padres del Novio", avatar: "/assets/esposos.jpeg" },
    { name: "José", role: "Padrino", avatar: "/assets/esposos.jpeg" },
    { name: "Carmen", role: "Madrina", avatar: "/assets/esposos.jpeg" },
    { name: "Roberto", role: "Hermano del Novio", avatar: "/assets/esposos.jpeg" },
    { name: "Lucía", role: "Hermana de la Novia", avatar: "/assets/esposos.jpeg" }
  ])

  const updateFamily = (updated) => {
    setFamilyMembers(updated)
    onDataChange?.({ title, familyMembers: updated })
  }

  const updateMember = (index, key, value) => {
    const updated = [...familyMembers]
    updated[index][key] = value
    updateFamily(updated)
  }

  const handleImageChange = (index) => (file) => {
    const newUrl = URL.createObjectURL(file)
    const updated = [...familyMembers]
    updated[index].avatar = newUrl
    updated[index].file = file
    updateFamily(updated)
    return false
  }

  const handleDelete = (index) => {
    const updated = [...familyMembers]
    updated.splice(index, 1)
    updateFamily(updated)
  }

  const handleAddMember = () => {
    const updated = [
      ...familyMembers,
      { name: "Nombre", role: "Rol", avatar: "" }
    ]
    updateFamily(updated)
  }

  const handleTitleChange = (val) => {
    setTitle(val)
    onDataChange?.({ title: val, familyMembers })
  }

  return (
    <Card className='card-invitation'>
      <div style={{ textAlign: 'center' }}>
        <Title
          level={1}
          style={{ color: '#4c4c4c', marginBottom: '30px', fontWeight: 'bold' }}
          editable={isEditing ? {
            triggerType: ['icon', 'text'],
            onChange: handleTitleChange
          } : false}
        >
          {title}
        </Title>

        <Row gutter={[24, 40]} justify="center">
          {familyMembers.map((member, index) => (
            <Col xs={24} sm={12} md={8} key={index}>
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                
                {isEditing && (
                  <CloseOutlined
                    onClick={() => handleDelete(index)}
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      fontSize: '16px',
                      color: '#ff4d4f',
                      cursor: 'pointer',
                      zIndex: 10
                    }}
                  />
                )}

                <Avatar
                  size={200}
                  src={member.avatar}
                  style={{
                    backgroundColor: 'white',
                    color: 'black',
                    fontSize: '40px',
                    marginBottom: '15px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                  }}
                />
                <Text
                  style={{
                    fontSize: '20px',
                    color: '#4c4c4c',
                    fontWeight: 'bold',
                    marginBottom: '5px'
                  }}
                  editable={isEditing ? {
                    triggerType: ['icon', 'text'],
                    onChange: (val) => updateMember(index, "name", val)
                  } : false}
                >
                  {member.name}
                </Text>
                <Text
                  style={{
                    fontSize: '16px',
                    color: '#7f8c8d'
                  }}
                  editable={isEditing ? {
                    triggerType: ['icon', 'text'],
                    onChange: (val) => updateMember(index, "role", val)
                  } : false}
                >
                  {member.role}
                </Text>

                {isEditing && (
                  <Upload
                    accept="image/*"
                    showUploadList={false}
                    beforeUpload={handleImageChange(index)}
                  >
                    <Button icon={<UploadOutlined />} size="small" type="primary" style={{ marginTop: 10 }}>
                      Cambiar imagen
                    </Button>
                  </Upload>
                )}
              </div>
            </Col>
          ))}
        </Row>

        {isEditing && (
          <div style={{ marginTop: '40px' }}>
            <Button
              icon={<PlusOutlined />}
              type="dashed"
              onClick={handleAddMember}
            >
              Agregar miembro
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}

export default PremiumInvitationFamily
