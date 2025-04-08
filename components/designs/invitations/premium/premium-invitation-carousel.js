import { Carousel, Card, Typography, Image } from "antd"

const { Title, Text } = Typography

const PremiumInvitationCarousel = () => {

  return (

    <Card className='card-invitation'>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Title level={2} style={{ color: '#4c4c4c', fontWeight: 'bold' }}>
          Recuerdos Especiales
        </Title>
        <Text style={{ fontSize: '18px', color: '#7f8c8d' }}>
          Un vistazo a los momentos que nos han traído hasta aquí
        </Text>
      </div>
      <Carousel arrows autoplay>
        <div>
          <Image
            src="/assets/carousel1.jpg"
            preview={false}
            alt="Recuerdo 1"
            width="100%"
            style={{ objectFit: 'cover', borderRadius: '10px' }}
          />
        </div>
        <div>
          <Image
            src="/assets/carousel2.jpeg"
            preview={false}
            alt="Recuerdo 2"
            width="100%"
            style={{ objectFit: 'cover', borderRadius: '10px' }}
          />
        </div>
        <div>
          <Image
            src="/assets/carousel3.webp"
            preview={false}
            alt="Recuerdo 3"
            width="100%"
            style={{ objectFit: 'cover', borderRadius: '10px' }}
          />
        </div>
        <div>
          <Image
            src="/assets/carousel4.webp"
            preview={false}
            alt="Recuerdo 4"
            width="100%"
            style={{ objectFit: 'cover', borderRadius: '10px' }}
          />
        </div>
      </Carousel>
    </Card>

  )
}

export default PremiumInvitationCarousel