import { Carousel, Card, Typography, Image } from "antd"

const { Title, Text } = Typography

const PremiumInvitationCarousel = () => {

  const carrouselImages = [
    { src: "/assets/carousel1.jpg", alt: "Recuerdo 1" },
    { src: "/assets/carousel2.jpeg", alt: "Recuerdo 2" },
    { src: "/assets/carousel3.webp", alt: "Recuerdo 3" },
    { src: "/assets/carousel4.webp", alt: "Recuerdo 4" }
  ]

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
        {carrouselImages.map((image, index) => (
          <div key={index}>
            <Image
              src={image.src}
              alt={image.alt}
              preview={false}
              width="100%"
              style={{ objectFit: 'cover', borderRadius: '10px' }}
            />
          </div>
        ))}
      </Carousel>
    </Card>
  )
}

export default PremiumInvitationCarousel