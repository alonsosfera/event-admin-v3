import { Row, Col, Card, Typography, Image } from "antd"

const { Title, Text } = Typography

const PremiumInvitationPlace = () => {

  return (

    <Card className='card-invitation'>
      <div style={{ textAlign: 'center' }}>
        <Row gutter={[ 24, 24 ]}>
          <Col xs={24}>
            <Title level={1} style={{ color: '#4c4c4c', marginBottom: '10px', fontWeight: 'bold' }}>
              ¿Dónde & Cuándo?
            </Title>
          </Col>
          <Col xs={24} sm={12}>
            <Title level={3} style={{ color: '#4c4c4c', marginBottom: '10px', fontWeight: 'bold' }}>
              Ceremonia
            </Title>
            <Image
              preview={false}
              src="/assets/basílica.jpg"
              alt="ceremonia"
              style={{ borderRadius: "8px" }}
            />
            <Title level={3} style={{ color: '#4c4c4c', marginBottom: '10px', fontWeight: 'bold' }}>
              Basílica de Guadalupe Monterrey
            </Title>
            <Text style={{ fontSize: '18px', color: '#7f8c8d', fontWeight: "bold" }}>
              Fecha:
            </Text>
            <Text style={{ fontSize: '18px', color: '#7f8c8d'}}>
              20 de junio de 2025 18:00 hrs
            </Text>
            <br/>
            <Text style={{ fontSize: '18px', color: '#7f8c8d', fontWeight: "bold" }}>
              Dirección:
            </Text>
            <Text style={{ fontSize: '18px', color: '#7f8c8d'}}>
              Guanajuato 715, Independencia, 64720 Monterrey, N.L.
            </Text>
          </Col>
          <Col xs={24} sm={12}>
            <Title level={3} style={{ color: '#4c4c4c', marginBottom: '10px', fontWeight: 'bold' }}>
              Recepción
            </Title>
            <Image
              preview={false}
              src="/assets/La_joya.jpg"
              alt="ceremonia"
              style={{ borderRadius: "8px" }}
            />
            <Title level={3} style={{ color: '#4c4c4c', marginBottom: '10px', fontWeight: 'bold' }}>
              Salón La Joya
            </Title>
            <Text style={{ fontSize: '18px', color: '#7f8c8d', fontWeight: "bold" }}>
              Fecha:
            </Text>
            <Text style={{ fontSize: '18px', color: '#7f8c8d'}}>
              20 de junio de 2025 20:00 hrs
            </Text>
            <br/>
            <Text style={{ fontSize: '18px', color: '#7f8c8d', fontWeight: "bold" }}>
              Dirección:
            </Text>
            <Text style={{ fontSize: '18px', color: '#7f8c8d'}}>
              Poner aqui la dirección real del salón
            </Text>
          </Col>
        </Row>
      </div>
    </Card>

  )
}

export default PremiumInvitationPlace