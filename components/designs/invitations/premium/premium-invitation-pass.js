import { Card, Row, Col, Image, Typography } from "antd"  
import { useState } from "react"

const { Title, Text } = Typography

  const PremiumInvitationPass = ({ isEditing, onDataChange }) => {
    const [subtitleText, setSubtitleText] = useState("Con alegría en el corazón, los esperamos para compartir nuestra unión y recibir juntos la bendición de Dios")

    const handleSubtitleChange = (value) => {
      setSubtitleText(value)
      onDataChange?.({ subtitleText: value })
    }

    return (
  
      <Card className='card-invitation'>
        <Row gutter={[0, 24]} style={{ marginTop: '20px' }}>
          <Col xs={{ span: 24, order: 2 }} sm={{ span: 8, order: 1  }} style={{ textAlign: 'center' }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}  >
              <Image
                preview={false}
                src="/assets/qr.png"
                width={150}
                alt="Banner de Boda"     
                />
              </div>
          </Col>
          <Col xs={{ span: 24, order: 1} } sm={{ span: 16, order: 2 }} style={{ textAlign: "center" }} >
            <Title level={2} style={{ color: '#4c4c4c', marginBottom: '10px', fontWeight: 'bold' }}>
            Invitación válida para:
            </Title>
            <Text style={{ fontSize: '18px', color: '#7f8c8d', fontWeight: "bold" }}>
              NOMBRE
            </Text>
            <br />
            <Text style={{ fontSize: '18px', color: '#7f8c8d' }}>
              Arturo Contreras Chaparro
            </Text>
              <Row gutter={[ 0 ]}> 
                <Col xs={24} sm={12}>
                  <Text style={{ fontSize: '18px', color: '#7f8c8d', fontWeight: "bold" }}>
                    PERSONAS
                  </Text>
                  <br />
                  <Text style={{ fontSize: '18px', color: '#7f8c8d' }}>
                    4
                  </Text>
                </Col>
                <Col xs={24} sm={12}>
                  <Text style={{ fontSize: '18px', color: '#7f8c8d', fontWeight: "bold" }}>
                    MESA
                  </Text>
                  <br />
                  <Text style={{ fontSize: '18px', color: '#7f8c8d' }}>
                    10
                  </Text>
                </Col>
              </Row>
            <Text style={{ fontSize: '18px', color: '#7f8c8d', fontWeight: "bold" }}>
              MENSAJE
            </Text>
            <br />
            <Text 
              style={{ fontSize: '18px', color: '#7f8c8d' }}
              editable={
                isEditing
                  ? {
                      triggerType: ['icon', 'text'],
                      onChange: handleSubtitleChange
                    }
                  : false
              }>
              {subtitleText}
            </Text>
          </Col>
        </Row>
      </Card>

    )
  }

  export default PremiumInvitationPass