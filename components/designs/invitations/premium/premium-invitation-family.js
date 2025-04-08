import { Card, Typography } from "antd"  

const { Title } = Typography

const PremiumInvitationFamily = () => {

  return ( 

    <Card className='card-invitation'> 
      <div style={{ marginTop: '40px', backgroundColor: '#f2f2f2', padding: '20px', borderRadius: '8px' }}>
        <Title level={3} style={{ color: '#4c4c4c', fontWeight: 'bold', marginBottom: '15px' }}>
          Nuestra Familia y Amigos
        </Title>
        <ul style={{ listStyleType: 'none', padding: '0' }}>
          <li style={{ fontSize: '18px', color: '#7f8c8d', marginBottom: '8px' }}>
            Padres de la Novia: María & Carlos
          </li>
          <li style={{ fontSize: '18px', color: '#7f8c8d', marginBottom: '8px' }}>
            Padres del Novio: Ana & Juan
          </li>
          <li style={{ fontSize: '18px', color: '#7f8c8d', marginBottom: '8px' }}>
            Padrino: José
          </li>
          <li style={{ fontSize: '18px', color: '#7f8c8d', marginBottom: '8px' }}>
            Madrina: Carmen
          </li>
        </ul>
      </div>
    </Card>
  )
}

export default PremiumInvitationFamily