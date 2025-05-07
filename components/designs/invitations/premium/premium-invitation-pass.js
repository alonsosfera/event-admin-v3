import { Row, Col, Image, Typography } from "antd"  
import { useState, useEffect } from "react"
import QRCode from 'qrcode'
import short from "short-uuid"

const { Title, Text } = Typography

const PremiumInvitationPass = ({ isEditing, onDataChange, sectionData, invitated, invitationId }) => {
  const [subtitleText, setSubtitleText] = useState(sectionData?.subtitleText || "Con alegría en el corazón, los esperamos para compartir nuestra unión y recibir juntos la bendición de Dios")
  const [qrCode, setQrCode] = useState("")

  const translator = short();

  const handleSubtitleChange = (value) => {
    setSubtitleText(value)
    onDataChange?.({ subtitleText: value })
  }

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        let qrData;

        if (invitationId) {
          const qrIdReplace = invitationId.substring(2)
          const qrId = translator.toUUID(qrIdReplace)
          qrData = `${process.env.NEXT_PUBLIC_APP_URI}/qr/${qrId}`
        } else {
          qrData = "VistaPreviadelCodigoQrSinFuncionar"
        }

        const qrImage = await QRCode.toDataURL(qrData)
        setQrCode(qrImage)
      } catch (err) {
        console.error("Error generating QR code:", err)
      }
    }

    generateQRCode()
  }, [invitationId]) 

  return (
    <>
      <Row gutter={[0, 24]} style={{ marginTop: '20px' }}>
        <Col xs={{ span: 24, order: 2 }} sm={{ span: 8, order: 1  }} style={{ textAlign: 'center' }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            {qrCode ? (
              <Image
                preview={false}
                src={qrCode}
                width={150}
                alt="Código QR de invitación"
              />
            ) : (
              <div>Cargando QR...</div>
            )}
          </div>
        </Col>
        <Col xs={{ span: 24, order: 1 }} sm={{ span: 16, order: 2 }} style={{ textAlign: "center" }} >
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
          <Row gutter={[0]}>
            <Col xs={24} sm={12}>
              <Text style={{ fontSize: '18px', color: '#7f8c8d', fontWeight: "bold" }}>
                INVITADOS
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
            editable={isEditing ? {
              triggerType: ['icon', 'text'],
              onChange: handleSubtitleChange
            } : false}
          >
            {subtitleText}
          </Text>
        </Col>
      </Row>
    </>
  )
}

export default PremiumInvitationPass
