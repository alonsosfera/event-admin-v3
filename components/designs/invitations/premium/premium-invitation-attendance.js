import { useState } from 'react'
import { Button, Card, Row, Typography, Col } from 'antd'

const { Title, Text } = Typography

const PremiumInvitationAttendance = ({ isEditing, onDataChange }) => {
  const [subtitle, setSubtitle] = useState(
    "Para nosotros es muy importante que nos acompañes, por favor confirma tu asistencia para poder considerarte."
  )

  const handleTextChange = (val) => {
    setSubtitle(val)
    onDataChange?.({ subtitle: val })
  }

  const handleConfirmAttendance = () => {
    console.log("click confirmar")
  }

  return (
    <Card className='card-invitation' style={{ textAlign: "center" }}>
      <Row justify="center">
        <Col xs={24} sm={16}>
          <Title
            level={2}
            style={{ color: '#4c4c4c', marginBottom: '10px', fontWeight: 'bold' }}
          >
            Confirmar Asistencia
          </Title>
          <Text
            style={{ fontSize: '18px', color: '#7f8c8d' }}
            editable={isEditing ? {
              triggerType: ['icon', 'text'],
              onChange: handleTextChange
            } : false}
          >
            {subtitle}
          </Text>
        </Col>
      </Row>
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Button
          type="primary"
          size="large"
          style={{
            backgroundColor: '#8e44ad',
            borderRadius: '8px',
            padding: '15px 30px',
            fontSize: '18px',
            width: '100%',
            maxWidth: '300px',
          }}
          onClick={handleConfirmAttendance}
        >
          Confirmar Asistencia
        </Button>
      </div>
    </Card>
  )
}

export default PremiumInvitationAttendance
