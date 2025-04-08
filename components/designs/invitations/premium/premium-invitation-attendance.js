import { Button, Card, Typography } from 'antd'

const { Title, Text } = Typography

const PremiumInvitationAttendance = () => {

  const handleConfirmAttendance = () => {
    console.log("click confirmar");
  }

  return (

    <Card className='card-invitation'>    
      <div style={{ marginTop: '30px' }}>
        <Title level={2} style={{ color: '#4c4c4c', marginBottom: '10px', fontWeight: 'bold' }}>
          Confirmar Asistencia
        </Title>
        <Text style={{ fontSize: '18px', color: '#7f8c8d' }}>
          Por favor confirma tu asistencia haciendo clic en el botón de abajo.
        </Text>
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
      </div>
    </Card>
  )
}

export default PremiumInvitationAttendance