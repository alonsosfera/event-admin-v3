import { Row, Col, Image, Typography } from "antd"  
import { useState } from "react"

const { Title, Text } = Typography

  const PremiumInvitationPass = ({ isEditing, onDataChange, sectionData, invitated }) => {
    const [subtitleText, setSubtitleText] = useState(sectionData?.subtitleText || "Con alegría en el corazón, los esperamos para compartir nuestra unión y recibir juntos la bendición de Dios")

    const handleSubtitleChange = (value) => {
      setSubtitleText(value)
      onDataChange?.({ subtitleText: value })
    }

    return (
      <>
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
              {invitated ? invitated.invitationName : "Nombre de cada invitado"}
            </Text>
              <Row gutter={[ 0 ]}> 
                <Col xs={24} sm={12}>
                  <Text style={{ fontSize: '18px', color: '#7f8c8d', fontWeight: "bold" }}>
                    PERSONAS
                  </Text>
                  <br />
                  <Text style={{ fontSize: '18px', color: '#7f8c8d' }}>
                  {invitated ? invitated.numberGuests : "##"}
                  </Text>
                </Col>
                <Col xs={24} sm={12}>
                  <Text style={{ fontSize: '18px', color: '#7f8c8d', fontWeight: "bold" }}>
                    MESA
                  </Text>
                  <br />
                  <Text style={{ fontSize: '18px', color: '#7f8c8d' }}>
                    {invitated ? 
                      invitated.invitationTables.map((table, index) => (
                        <span key={index}>
                          {table.table.split('-')[1]}
                          {index < invitated.invitationTables.length - 1 && ", "}
                        </span>
                      ))
                      : "##"
                    }
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
      </>

    )
  }

  export default PremiumInvitationPass