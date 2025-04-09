import { Card, Typography, Row, Col, Avatar } from "antd"  

const { Title, Text } = Typography

const PremiumInvitationFamily = () => {

  const familyMembers = [
    { name: "María & Carlos", role: "Padres de la Novia", avatar: "/assets/esposos.jpeg" },
    { name: "Ana & Juan", role: "Padres del Novio", avatar: "/assets/esposos.jpeg" },
    { name: "José", role: "Padrino", avatar: "/assets/esposos.jpeg" },
    { name: "Carmen", role: "Madrina", avatar: "/assets/esposos.jpeg" },
    { name: "Roberto", role: "Hermano del Novio", avatar: "/assets/esposos.jpeg" },
    { name: "Lucía", role: "Hermana de la Novia", avatar: "/assets/esposos.jpeg" }
  ];

  return ( 
    <Card className='card-invitation'> 
      <div style={{ textAlign: 'center' }}>
        <Title level={1} style={{ color: '#4c4c4c', marginBottom: '30px', fontWeight: 'bold' }}>
          Nuestra Familia y Amigos
        </Title>
        
        <Row gutter={[24, 40]} justify="center">
          {familyMembers.map((member, index) => (
            <Col xs={24} sm={12} md={8} key={index}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar 
                  size={200} 
                  src={member.avatar}
                  style={{ 
                    backgroundColor: 'white', 
                    color: 'black',
                    fontSize: '40px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: '15px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                  }}
                >
                </Avatar>
                <Text style={{ 
                  fontSize: '20px', 
                  color: '#4c4c4c', 
                  fontWeight: 'bold',
                  marginBottom: '5px'
                }}>
                  {member.name}
                </Text>
                <Text style={{ 
                  fontSize: '16px', 
                  color: '#7f8c8d' 
                }}>
                  {member.role}
                </Text>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </Card>
  )
}

export default PremiumInvitationFamily