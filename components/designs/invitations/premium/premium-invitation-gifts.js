import { Col, Row, Typography, Card, Button } from 'antd'
import { GiftOutlined, BankOutlined } from '@ant-design/icons'

const { Text, Title } = Typography

const PremiumInvitationGift = ({ isEditing }) => {

  return (

    <Card className='card-invitation' style={{ textAlign: "center" }}> 
      <Title level={1} style={{ color: '#4c4c4c', marginBottom: '10px', fontWeight: 'bold' }}>
        Regalos
      </Title>
      <Text style={{ display: "block", fontSize: '16px', color: '#7f8c8d', fontWeight: "bold", marginTop: "40px" }}>
        Tu presencia es nuestro mayor regalo, pero si deseas contribuir con algo especial, aquí tienes algunas opciones
      </Text>

      <Row gutter={[16, 16]} justify="center" style={{ marginTop: "60px" }}>
        <Col xs={24} sm={12}>
          <Button
            type="default"
            size="large"
            href="https://mesaderegalos.liverpool.com.mx/"
            target="_blank"
            icon={<GiftOutlined style={{ fontSize: '28px', color: '#8e44ad' }} />}
            style={{
              padding: '30px 40px',
              fontSize: '20px',
              fontWeight: 'bold',
              height: 'auto',
              minHeight: '64px',
              gap: '16px',
              width: '100%',
            }}
          >
            Mesa de Regalos
          </Button>
        </Col>

        <Col xs={24} sm={12}>
          <Button
            type="default"
            size="large"
            block
            target="_blank"
            icon={<BankOutlined style={{ fontSize: '28px', color: '#8e44ad' }} />}
            style={{
              padding: '30px 40px',
              fontSize: '20px',
              fontWeight: 'bold',
              height: 'auto',
              minHeight: '64px',
              gap: '16px',
              width: '100%',
            }}
          >
            Sobre de Efectivo
          </Button>
        </Col>
      </Row>
    </Card>
  )
}

export default PremiumInvitationGift