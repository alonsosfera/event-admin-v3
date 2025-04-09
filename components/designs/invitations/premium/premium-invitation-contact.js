import { Card, Row, Typography, Col, Avatar } from 'antd'
import { PhoneOutlined, UserOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const PremiumInvitationContact = () => {
  const contacts = [
    { name: "Carla", phone: "555-901-3030", avatar: "/assets/mujer.jpg" },
    { name: "Luis", phone: "555-901-3030", avatar: "/assets/hombre.jpg" }
  ];

  return (
    <Card className='card-invitation' style={{ textAlign: "center" }}>   
      <Title level={1} style={{ color: '#4c4c4c', marginBottom: '30px', fontWeight: 'bold' }}>
        Contacto
      </Title>
      <Text style={{ 
        fontSize: '18px', 
        color: '#7f8c8d',
        display: 'block',
        marginBottom: '40px'
      }}>
        Si tienes alguna duda, no dudes en contactarnos
      </Text>

      <Row gutter={[24, 24]} justify="center">
        {contacts.map((contact, index) => (
          <Col xs={24} sm={12} key={index}>
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
              <Title level={2} style={{ 
                color: '#4c4c4c', 
                fontWeight: 'bold',
                marginBottom: '10px'
              }}>
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
                <Text style={{ 
                  fontSize: '18px', 
                  color: '#7f8c8d'
                }}>
                  {contact.phone}
                </Text>
              </div>

            </div>
          </Col>
        ))}
      </Row>
    </Card>
  )
}

export default PremiumInvitationContact 